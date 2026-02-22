import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { PaymentServiceModule } from './payment-service.module';
import { KAFKA_BROKERS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS,
      },
      consumer: {
        groupId: 'payment-service-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(3003);
  console.log(`Payment Service is running on: ${await app.getUrl()}`);
}
bootstrap();

