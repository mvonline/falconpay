import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Wallet, WalletMember, MemberRole, WalletType } from './entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from './entities/wallet-transaction.entity';
import { KafkaTopics, ServiceNames } from '@app/common';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletMember)
    private readonly memberRepository: Repository<WalletMember>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
    @Inject(ServiceNames.WALLET)
    private readonly kafkaClient: ClientKafka,
  ) { }

  async createPersonalWallet(userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = queryRunner.manager.create(Wallet, {
        type: WalletType.PERSONAL,
        balance: 0,
      });
      const savedWallet = await queryRunner.manager.save(wallet);

      const member = queryRunner.manager.create(WalletMember, {
        walletId: savedWallet.id,
        userId,
        role: MemberRole.OWNER,
      });
      await queryRunner.manager.save(member);

      await queryRunner.commitTransaction();
      this.logger.log(`Personal wallet created for user: ${userId}`);
      return savedWallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(userId: string) {
    const member = await this.memberRepository.findOne({
      where: { userId, role: MemberRole.OWNER },
      relations: ['wallet'],
    });

    if (!member) {
      // Proactively create wallet if missing (e.g. race condition)
      return this.createPersonalWallet(userId).then(w => w.balance);
    }

    return member.wallet.balance;
  }

  async handlePaymentCreated(data: { transactionId: string; senderId: string; receiverId: string; amount: number }) {
    this.logger.log(`Processing payment: ${data.transactionId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Idempotency Check: Has this transaction already been processed for the sender?
      const existingTx = await queryRunner.manager.findOne(WalletTransaction, {
        where: { referenceId: data.transactionId },
      });

      if (existingTx) {
        this.logger.warn(`Transaction ${data.transactionId} already processed. Skipping.`);
        await queryRunner.rollbackTransaction();
        return;
      }

      // 2. Find and Lock Sender Wallet
      const senderMember = await queryRunner.manager.findOne(WalletMember, {
        where: { userId: data.senderId, role: MemberRole.OWNER },
      });

      if (!senderMember) {
        throw new BadRequestException('Sender wallet not found');
      }

      const senderWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: senderMember.walletId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!senderWallet || Number(senderWallet.balance) < data.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // 3. Find and Lock Receiver Wallet
      const receiverMember = await queryRunner.manager.findOne(WalletMember, {
        where: { userId: data.receiverId, role: MemberRole.OWNER },
      });

      if (!receiverMember) {
        throw new BadRequestException('Receiver wallet not found');
      }

      const receiverWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: receiverMember.walletId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!receiverWallet) {
        throw new BadRequestException('Receiver wallet not found');
      }

      // 4. Atomic Balance Update
      senderWallet.balance = Number(senderWallet.balance) - data.amount;
      receiverWallet.balance = Number(receiverWallet.balance) + data.amount;

      await queryRunner.manager.save([senderWallet, receiverWallet]);

      // 5. Record Ledger Entries (for audit and further idempotency)
      await queryRunner.manager.save(WalletTransaction, [
        {
          walletId: senderWallet.id,
          amount: data.amount,
          type: WalletTransactionType.DEBIT,
          referenceId: data.transactionId,
          description: `Payment to ${data.receiverId}`,
        },
        {
          walletId: receiverWallet.id,
          amount: data.amount,
          type: WalletTransactionType.CREDIT,
          referenceId: data.transactionId,
          description: `Payment from ${data.senderId}`,
        },
      ]);

      await queryRunner.commitTransaction();

      // 6. Emit success events
      this.kafkaClient.emit(KafkaTopics.WALLET_DEBITED, { transactionId: data.transactionId });
      this.kafkaClient.emit(KafkaTopics.PAYMENT_COMPLETED, {
        transactionId: data.transactionId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        amount: data.amount,
      });

      this.logger.log(`Payment successful: ${data.transactionId}`);

    } catch (err) {
      await queryRunner.rollbackTransaction();

      // Handle unique constraint violation (concurrency/idempotency race)
      if (err.code === '23505') {
        this.logger.warn(`Duplicate transaction processing detected for ${data.transactionId}.`);
        return;
      }

      this.logger.error(`Payment failed for ${data.transactionId}: ${err.message}`);

      this.kafkaClient.emit(KafkaTopics.PAYMENT_FAILED, {
        transactionId: data.transactionId,
        reason: err.message
      });
    } finally {
      await queryRunner.release();
    }
  }

}
