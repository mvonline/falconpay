import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../payment-service/src/entities/transaction.entity';
import { Wallet } from '../../wallet-service/src/entities/wallet.entity';
import { WalletTransaction } from '../../wallet-service/src/entities/wallet-transaction.entity';

@Injectable()
export class ReconciliationService {
    private readonly logger = new Logger(ReconciliationService.name);

    constructor(
        @InjectRepository(Transaction)
        private readonly paymentRepo: Repository<Transaction>,
        @InjectRepository(Wallet)
        private readonly walletRepo: Repository<Wallet>,
        @InjectRepository(WalletTransaction)
        private readonly walletTxRepo: Repository<WalletTransaction>,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async runAudit() {
        this.logger.log('🚀 Starting Financial Reconciliation Audit...');

        try {
            // 1. Get Sum of all COMPLETED payments
            const paymentSumResult = await this.paymentRepo
                .createQueryBuilder('t')
                .select('SUM(t.amount)', 'total')
                .where('t.status = :status', { status: 'COMPLETED' })
                .getRawOne();

            const totalPaymentVolume = Number(paymentSumResult.total || 0);

            // 2. Get Sum of all Wallet Transaction Credits (Inflow)
            // Note: In a real system, we would filter by type and currency
            const walletCreditResult = await this.walletTxRepo
                .createQueryBuilder('wt')
                .select('SUM(wt.amount)', 'total')
                .where('wt.type = :type', { type: 'CREDIT' })
                .getRawOne();

            const totalWalletCredits = Number(walletCreditResult.total || 0);

            const discrepancy = Math.abs(totalPaymentVolume - totalWalletCredits);

            if (discrepancy > 0.001) { // Allowing for tiny float precision diff if any
                this.logger.error(
                    `🛑 CRITICAL DISCREPANCY DETECTED! ` +
                    `Payments: ${totalPaymentVolume} OMR | Wallet Credits: ${totalWalletCredits} OMR | ` +
                    `Diff: ${discrepancy} OMR`
                );
            } else {
                this.logger.log(`✅ Reconciliation Successful. Ledgers are in sync. Volume: ${totalPaymentVolume} OMR`);
            }
        } catch (err) {
            this.logger.error(`❌ Reconciliation Audit Failed: ${err.message}`);
        }
    }
}
