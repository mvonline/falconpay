import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, KafkaModule, ServiceNames, SharedConfigModule } from '@app/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';
import { OutboxProcessor } from './outbox.processor';
import { Transaction } from './entities/transaction.entity';
import { Account } from './entities/account.entity';
import { Outbox } from '@app/common';
import { StubBankProvider } from './banks/bank.interface';


@Module({
  imports: [
    SharedConfigModule.register('./apps/payment-service/.env'),
    DatabaseModule,
    ScheduleModule.forRoot(),

    KafkaModule.register(ServiceNames.PAYMENT),
    TypeOrmModule.forFeature([Transaction, Account, Outbox]),
  ],

  controllers: [PaymentServiceController],
  providers: [PaymentServiceService, OutboxProcessor, StubBankProvider],
})

export class PaymentServiceModule { }


