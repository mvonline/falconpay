import { NestFactory } from '@nestjs/core';
import { ReconciliationModule } from './reconciliation-service.module';
import { FalconLogger, initTracing } from '@app/common';

async function bootstrap() {
    // Initialize Tracing
    await initTracing('reconciliation-service');

    const app = await NestFactory.create(ReconciliationModule, {
        logger: new FalconLogger('reconciliation-service'),
    });


    await app.listen(3007);
    console.log('🛡️ Reconciliation Service is auditing FalconPay...');
}
bootstrap();
