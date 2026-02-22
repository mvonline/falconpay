import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Outbox, OutboxStatus, ServiceNames } from '@app/common';

@Injectable()
export class OutboxProcessor {
    private readonly logger = new Logger(OutboxProcessor.name);

    constructor(
        @InjectRepository(Outbox)
        private readonly outboxRepository: Repository<Outbox>,
        @Inject(ServiceNames.PAYMENT)
        private readonly kafkaClient: ClientKafka,
    ) { }

    @Cron(CronExpression.EVERY_SECOND)
    async processOutbox() {
        const messages = await this.outboxRepository.find({
            where: { status: OutboxStatus.PENDING },
            take: 50, // Batch processing
            order: { createdAt: 'ASC' },
        });

        if (messages.length === 0) return;

        this.logger.debug(`Found ${messages.length} pending outbox messages. Processing...`);

        for (const message of messages) {
            try {
                // 1. Emit to Kafka
                await this.kafkaClient.emit(message.topic, message.payload).toPromise();

                // 2. Mark as Processed
                message.status = OutboxStatus.PROCESSED;
                await this.outboxRepository.save(message);

                this.logger.log(`Outbox message ${message.id} sent to topic ${message.topic}`);
            } catch (err) {
                this.logger.error(`Failed to process outbox message ${message.id}: ${err.message}`);

                message.retryCount += 1;
                message.error = err.message;

                if (message.retryCount >= 5) {
                    message.status = OutboxStatus.FAILED;
                }

                await this.outboxRepository.save(message);
            }
        }
    }
}
