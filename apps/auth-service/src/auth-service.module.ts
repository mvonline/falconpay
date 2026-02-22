import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule, KafkaModule, ServiceNames, SharedConfigModule } from '@app/common';

import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { User } from './entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { TwoFactorService } from './two-factor.service';
import { JwtStrategy } from '@app/common';
import { OidcStrategy } from './strategies/oidc.strategy';

@Module({
  imports: [
    SharedConfigModule.register('./apps/auth-service/.env'),
    DatabaseModule,

    KafkaModule.register(ServiceNames.AUTH),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, JwtStrategy, LocalStrategy, TwoFactorService, OidcStrategy],
})
export class AuthServiceModule { }




