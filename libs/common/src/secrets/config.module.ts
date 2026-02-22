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
                    validationSchema: Joi.object({
                        KAFKA_BROKERS: Joi.string().required(),
                        DB_HOST: Joi.string().required(),
                        DB_PORT: Joi.number().required(),
                        DB_USERNAME: Joi.string().required(),
                        DB_PASSWORD: Joi.string().required(),
                        JWT_SECRET: Joi.string().default('secret'),
                        USE_VAULT: Joi.boolean().default(false),
                        VAULT_ADDR: Joi.string().optional(),
                        VAULT_TOKEN: Joi.string().optional(),
                    }),
                }),
            ],
            providers: [SecretManagerService],
            exports: [ConfigModule, SecretManagerService],
        };
    }
}

