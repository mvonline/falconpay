import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, OptimisticLockVersionMismatchError } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Wallet, WalletMember, MemberRole, WalletType } from './entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from './entities/wallet-transaction.entity';
import { KafkaTopics, ServiceNames, RedlockService } from '@app/common';

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
    private readonly redlock: RedlockService,
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
        version: 1,
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
      return this.createPersonalWallet(userId).then(w => w.balance);
    }

    return member.wallet.balance;
  }

  /**
   * Triple-Layer Concurrency Control Implementation
   */
  async handlePaymentCreated(data: { transactionId: string; senderId: string; receiverId: string; amount: number }) {
    this.logger.log(`Processing payment with Triple-Layer Concurrency: ${data.transactionId}`);

    // Retry Layer 2 (Optimistic) failures
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        await this.processTransaction(data);
        return; // Success
      } catch (err) {
        if (err instanceof OptimisticLockVersionMismatchError) {
          attempt++;
          this.logger.warn(`Optimistic lock failure for ${data.transactionId}, retrying (${attempt}/${MAX_RETRIES})...`);
          await new Promise(res => setTimeout(res, 50 * attempt)); // Linear backoff
          continue;
        }
        // For other errors, don't retry
        throw err;
      }
    }

    throw new Error(`Failed to process transaction ${data.transactionId} after ${MAX_RETRIES} attempts due to high contention.`);
  }

  private async processTransaction(data: { transactionId: string; senderId: string; receiverId: string; amount: number }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let lock;

    try {
      // 1. Idempotency Check (The Foundation)
      const existingTx = await queryRunner.manager.findOne(WalletTransaction, {
        where: { referenceId: data.transactionId },
      });

      if (existingTx) {
        this.logger.warn(`Transaction ${data.transactionId} already processed. Skipping.`);
        await queryRunner.rollbackTransaction();
        return;
      }

      // 2. Fetch Wallet IDs
      const senderMember = await this.memberRepository.findOne({ where: { userId: data.senderId, role: MemberRole.OWNER } });
      const receiverMember = await this.memberRepository.findOne({ where: { userId: data.receiverId, role: MemberRole.OWNER } });

      if (!senderMember || !receiverMember) throw new BadRequestException('Wallet not found');

      // --- LAYER 1: Distributed Locking (Redlock) ---
      // Deadlock Prevention: Sort IDs to ensure deterministic lock ordering
      const resourceIds = [senderMember.walletId, receiverMember.walletId].sort();
      lock = await this.redlock.acquire(resourceIds.map(id => `wallet:lock:${id}`), 5000);

      // --- LAYER 2: Optimistic Locking ---
      // TypeORM @VersionColumn will handle this automatically on .save()
      const senderWallet = await queryRunner.manager.findOne(Wallet, { where: { id: senderMember.walletId } });
      const receiverWallet = await queryRunner.manager.findOne(Wallet, { where: { id: receiverMember.walletId } });

      if (!senderWallet || !receiverWallet) throw new BadRequestException('Wallet mismatch');
      if (Number(senderWallet.balance) < data.amount) throw new BadRequestException('Insufficient balance');

      // --- LAYER 3: Atomic SQL Update (The Ultimate Guard) ---
      // We perform the actual deduction using a conditional WHERE to prevent negative balance even if apps logic fails
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(Wallet)
        .set({
          balance: () => `balance - ${data.amount}`,
          // TypeORM will automatically increment the version column if we use .save(), 
          // but since we are doing custom SQL, we increment manually to stay in sync with Layer 2
          version: senderWallet.version + 1
        })
        .where("id = :id AND balance >= :amount AND version = :version", {
          id: senderWallet.id,
          amount: data.amount,
          version: senderWallet.version
        })
        .execute();

      if (updateResult.affected === 0) {
        throw new OptimisticLockVersionMismatchError(Wallet.name, senderWallet.version, senderWallet.version + 1);
      }

      // Credit the receiver
      await queryRunner.manager
        .createQueryBuilder()
        .update(Wallet)
        .set({
          balance: () => `balance + ${data.amount}`,
          version: receiverWallet.version + 1
        })
        .where("id = :id AND version = :version", {
          id: receiverWallet.id,
          version: receiverWallet.version
        })
        .execute();

      // 3. Record Transactions
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

      // Emit Events
      this.kafkaClient.emit(KafkaTopics.WALLET_DEBITED, { transactionId: data.transactionId });
      this.kafkaClient.emit(KafkaTopics.PAYMENT_COMPLETED, {
        transactionId: data.transactionId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        amount: data.amount,
      });

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // Re-throw to handle retries in parent
    } finally {
      if (lock) await lock.release();
      await queryRunner.release();
    }
  }
}

