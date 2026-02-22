import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedlockService implements OnModuleInit {
    private redisClient: Redis;
    private redlock: Redlock;
    private readonly logger = new Logger(RedlockService.name);

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const host = this.configService.get('REDIS_HOST', 'localhost');
        const port = this.configService.get('REDIS_PORT', 6379);

        this.redisClient = new Redis({
            host,
            port,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        this.redlock = new Redlock([this.redisClient], {
            driftFactor: 0.01,
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200,
            automaticExtensionThreshold: 500,
        });

        this.redlock.on('error', (error) => {
            this.logger.error('Redlock Error', error);
        });
    }

    async acquire(resources: string[], ttl: number) {
        return this.redlock.acquire(resources, ttl);
    }
}
