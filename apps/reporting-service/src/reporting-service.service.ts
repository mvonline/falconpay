import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionReport } from './entities/transaction-report.entity';

@Injectable()
export class ReportingServiceService {
  private readonly logger = new Logger(ReportingServiceService.name);

  constructor(
    @InjectRepository(TransactionReport)
    private readonly reportRepo: Repository<TransactionReport>,
  ) { }

  async handlePaymentCompleted(data: { transactionId: string; senderId: string; receiverId: string; amount: number }) {
    this.logger.log(`Logging completed transaction: ${data.transactionId}`);

    await this.reportRepo.save({
      transactionId: data.transactionId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      amount: data.amount,
      status: 'COMPLETED',
    });
  }

  async handlePaymentFailed(data: { transactionId: string; reason: string }) {
    this.logger.warn(`Logging failed transaction: ${data.transactionId}`);

    const existing = await this.reportRepo.findOne({ where: { transactionId: data.transactionId } });
    if (existing) {
      existing.status = 'FAILED';
      existing.failureReason = data.reason;
      await this.reportRepo.save(existing);
    } else {
      await this.reportRepo.save({
        transactionId: data.transactionId,
        senderId: 'unknown',
        receiverId: 'unknown',
        amount: 0,
        status: 'FAILED',
        failureReason: data.reason,
      });
    }
  }

  async getTransactionStats(filters?: {
    status?: string;
    senderId?: string;
    receiverId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const query = this.reportRepo.createQueryBuilder('report');

    if (filters?.status) {
      query.andWhere('report.status = :status', { status: filters.status });
    }

    if (filters?.senderId) {
      query.andWhere('report.senderId = :senderId', { senderId: filters.senderId });
    }

    if (filters?.receiverId) {
      query.andWhere('report.receiverId = :receiverId', { receiverId: filters.receiverId });
    }

    if (filters?.startDate) {
      query.andWhere('report.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('report.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters?.search) {
      query.andWhere(
        '(report.transactionId LIKE :search OR report.senderId LIKE :search OR report.receiverId LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    query.orderBy('report.createdAt', 'DESC');
    return query.getMany();
  }

  async exportToCsv(filters?: any): Promise<string> {
    const records = await this.getTransactionStats(filters);
    const header = 'TransactionID,Sender,Receiver,Amount,Status,Date\n';
    const rows = records.map(r =>
      `${r.transactionId},${r.senderId},${r.receiverId},${r.amount},${r.status},${r.createdAt.toISOString()}`
    ).join('\n');

    return header + rows;
  }
}

