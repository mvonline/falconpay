import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_BROKERS } from '../constants';

@Module({})
export class KafkaModule {
    static register(serviceName: string): DynamicModule {
        return {
            module: KafkaModule,
            imports: [
                ClientsModule.register([
                    {
                        name: serviceName,
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: serviceName.toLowerCase(),
                                brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : KAFKA_BROKERS,
                            },
                            consumer: {
                                groupId: `${serviceName.toLowerCase()}-consumer`,
                            },
                        },
                    },
                ]),
            ],
            exports: [ClientsModule],
        };
    }
}
