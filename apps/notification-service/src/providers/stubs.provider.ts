import { Injectable, Logger } from '@nestjs/common';
import { INotificationProvider, NotificationType, ISmsPayload, IEmailPayload, IPushPayload } from './provider.interface';

@Injectable()
export class SmsProvider implements INotificationProvider {
    type = NotificationType.SMS;
    private readonly logger = new Logger(SmsProvider.name);

    async send(to: string, payload: ISmsPayload): Promise<boolean> {
        this.logger.log(`[SMS Provider] Sending to ${to}: ${payload.message}`);
        return true; // Stub
    }
}

@Injectable()
export class EmailProvider implements INotificationProvider {
    type = NotificationType.EMAIL;
    private readonly logger = new Logger(EmailProvider.name);

    async send(to: string, payload: IEmailPayload): Promise<boolean> {
        this.logger.log(`[Email Provider] Sending to ${to}: ${payload.subject}`);
        return true; // Stub
    }
}

@Injectable()
export class PushProvider implements INotificationProvider {
    type = NotificationType.PUSH;
    private readonly logger = new Logger(PushProvider.name);

    async send(to: string, payload: IPushPayload): Promise<boolean> {
        this.logger.log(`[Push Provider] Sending to ${to}: ${payload.title}`);
        return true; // Stub
    }
}
