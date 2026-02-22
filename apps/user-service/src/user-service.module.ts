import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, KafkaModule, ServiceNames, SharedConfigModule } from '@app/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { Profile } from './entities/profile.entity';
import { StubKycProvider } from './kyc/kyc-provider.interface';

@Module({
  imports: [
    SharedConfigModule.register('./apps/user-service/.env'),
    DatabaseModule,

    KafkaModule.register(ServiceNames.USER),
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService, StubKycProvider],
})
export class UserServiceModule { }


