import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class KafkaModule {
    static register(serviceName: string): DynamicModule {
        return {
            module: KafkaModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name: serviceName,
                        imports: [ConfigModule],
                        inject: [ConfigService],
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.KAFKA,
                            options: {
                                client: {
                                    clientId: serviceName.toLowerCase(),
                                    brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
                                },
                                consumer: {
                                    groupId: `${serviceName.toLowerCase()}-consumer`,
                                },
                            },
                        }),
                    },
                ]),
            ],
            exports: [ClientsModule],
        };
    }
}
