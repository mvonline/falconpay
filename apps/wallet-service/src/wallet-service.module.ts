import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, KafkaModule, ServiceNames, SharedConfigModule, JwtStrategy } from '@app/common';
import { WalletServiceController } from './wallet-service.controller';
import { WalletService } from './wallet-service.service';
import { Wallet, WalletMember } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

@Module({
  imports: [
    SharedConfigModule.register('./apps/wallet-service/.env'),
    DatabaseModule,

    KafkaModule.register(ServiceNames.WALLET),
    TypeOrmModule.forFeature([Wallet, WalletMember, WalletTransaction]),
  ],
  controllers: [WalletServiceController],
  providers: [WalletService, JwtStrategy],
})
export class WalletServiceModule { }
