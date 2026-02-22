import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { KafkaTopics, ServiceNames, Outbox, OutboxStatus } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentServiceService {
  private readonly logger = new Logger(PaymentServiceService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(ServiceNames.PAYMENT)
    private readonly kafkaClient: ClientKafka,
    private readonly dataSource: DataSource,
  ) { }

  async createTransfer(userId: string, createTransferDto: CreateTransferDto) {
    const { receiverId, amount, description } = createTransferDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create Transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        senderId: userId,
        receiverId,
        amount,
        description,
        status: 'PENDING',
        type: 'A2A_TRANSFER',
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // 2. Create Outbox message in SAME transaction
      const outbox = queryRunner.manager.create(Outbox, {
        topic: KafkaTopics.PAYMENT_CREATED,
        payload: {
          transactionId: savedTransaction.id,
          senderId: savedTransaction.senderId,
          receiverId: savedTransaction.receiverId,
          amount: savedTransaction.amount,
          currency: savedTransaction.currency,
        },
        status: OutboxStatus.PENDING,
      });
      await queryRunner.manager.save(outbox);

      await queryRunner.commitTransaction();
      this.logger.log(`Transaction ${savedTransaction.id} and Outbox message saved atomically.`);

      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create transfer: ${err.message}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async getTransaction(id: string) {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async updateTransactionStatus(id: string, status: string) {
    return this.transactionRepository.update(id, { status });
  }
}

