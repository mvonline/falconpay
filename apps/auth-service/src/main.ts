import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AuthServiceModule } from './auth-service.module';
import { KAFKA_BROKERS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS,
      },
      consumer: {
        groupId: 'auth-service-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3001);
  console.log(`Auth Service is running on: ${await app.getUrl()}`);
}
bootstrap();

