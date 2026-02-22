import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedlockService } from './redlock.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [RedlockService],
    exports: [RedlockService],
})
export class RedisModule { }
