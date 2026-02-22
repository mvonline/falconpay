import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INotificationProvider, NotificationType } from './provider.interface';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';

@Injectable()
export class MailgunProvider implements INotificationProvider {
    private readonly logger = new Logger(MailgunProvider.name);
    private client: any;
    type = NotificationType.EMAIL;

    constructor(private readonly configService: ConfigService) {
        const mg = new Mailgun(formData as any);
        const key = this.configService.get<string>('MAILGUN_API_KEY');

        if (key) {
            this.client = mg.client({ username: 'api', key });
        }
    }

    async send(to: string, payload: { subject: string; body: string }): Promise<boolean> {
        if (!this.client) {
            this.logger.warn('Mailgun client not initialized. Skipping send.');
            return false;
        }

        try {
            const domain = this.configService.get<string>('MAILGUN_DOMAIN');
            await this.client.messages.create(domain, {
                from: `FalconPay <no-reply@${domain}>`,
                to: [to],
                subject: payload.subject,
                text: payload.body,
                html: payload.body,
            });
            return true;
        } catch (err) {
            this.logger.error(`Mailgun send failed: ${err.message}`);
            return false;
        }
    }
}
