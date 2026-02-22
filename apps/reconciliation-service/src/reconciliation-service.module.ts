import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, SharedConfigModule, ServiceNames } from '@app/common';
import { ReconciliationService } from './reconciliation.service';
import { Transaction } from '../../payment-service/src/entities/transaction.entity';
import { Wallet } from '../../wallet-service/src/entities/wallet.entity';
import { WalletTransaction } from '../../wallet-service/src/entities/wallet-transaction.entity';

@Module({
    imports: [
        SharedConfigModule.register('./apps/reconciliation-service/.env'),
        DatabaseModule,
        ScheduleModule.forRoot(),
        // Connect to both databases (Simplified for now - using reporting db strategy or direct access)
        TypeOrmModule.forFeature([Transaction, Wallet, WalletTransaction]),
    ],
    providers: [ReconciliationService],
})
export class ReconciliationModule { }
