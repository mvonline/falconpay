import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReportingServiceModule } from './reporting-service.module';
import { KAFKA_BROKERS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ReportingServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS,
      },
      consumer: {
        groupId: 'reporting-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3006);
  console.log(`Reporting Service is running on: ${await app.getUrl()}`);
}
bootstrap();

