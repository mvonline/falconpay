import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, KafkaModule, ServiceNames, SharedConfigModule } from '@app/common';
import { ReportingServiceController } from './reporting-service.controller';
import { ReportingServiceService } from './reporting-service.service';
import { TransactionReport } from './entities/transaction-report.entity';

@Module({
  imports: [
    SharedConfigModule.register('./apps/reporting-service/.env'),
    DatabaseModule,
    KafkaModule.register(ServiceNames.REPORTING),
    TypeOrmModule.forFeature([TransactionReport]),
  ],
  controllers: [ReportingServiceController],
  providers: [ReportingServiceService],
})
export class ReportingServiceModule { }


