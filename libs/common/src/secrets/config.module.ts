import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecretManagerService } from './secret-manager.service';
import * as Joi from 'joi';

@Global()
@Module({})
export class SharedConfigModule {
    static register(envFilePath: string = '.env'): DynamicModule {
        return {
            module: SharedConfigModule,
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath,
                    // All vars are optional here — each service is responsible
                    // for providing the vars it needs via docker-compose env or .env file.
                    // Joi is only used for typing/defaults, not as a strict gatekeeper.
                    validationSchema: Joi.object({
                        KAFKA_BROKERS: Joi.string().optional(),
                        DB_HOST: Joi.string().optional(),
                        DB_PORT: Joi.number().optional(),
                        DB_USERNAME: Joi.string().optional(),
                        DB_PASSWORD: Joi.string().optional(),
                        DB_NAME: Joi.string().optional(),
                        DB_SYNC: Joi.boolean().optional(),
                        REDIS_HOST: Joi.string().optional(),
                        REDIS_PORT: Joi.number().optional(),
                        MONGO_URI: Joi.string().optional(),
                        JWT_SECRET: Joi.string().default('secret'),
                        USE_VAULT: Joi.boolean().default(false),
                        VAULT_ADDR: Joi.string().optional(),
                        VAULT_TOKEN: Joi.string().optional(),
                    }),
                    validationOptions: {
                        allowUnknown: true,
                        abortEarly: false,
                    },
                }),
            ],
            providers: [SecretManagerService],
            exports: [ConfigModule, SecretManagerService],
        };
    }
}
