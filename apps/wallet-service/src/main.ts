import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { WalletServiceModule } from './wallet-service.module';
import { KAFKA_BROKERS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(WalletServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS,
      },
      consumer: {
        groupId: 'wallet-service-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(3004);
  console.log(`Wallet Service is running on: ${await app.getUrl()}`);
}
bootstrap();
