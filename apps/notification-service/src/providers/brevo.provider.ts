import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INotificationProvider, NotificationType } from './provider.interface';
import * as BREVO from '@getbrevo/brevo';

@Injectable()
export class BrevoProvider implements INotificationProvider {
    private readonly logger = new Logger(BrevoProvider.name);
    private client: BREVO.TransactionalEmailsApi;
    type = NotificationType.EMAIL;

    constructor(private readonly configService: ConfigService) {
        const key = this.configService.get<string>('BREVO_API_KEY');

        if (key) {
            this.client = new BREVO.TransactionalEmailsApi();
            this.client.setApiKey(BREVO.TransactionalEmailsApiApiKeys.apiKey, key);
        }
    }

    async send(to: string, payload: { subject: string; body: string }): Promise<boolean> {
        if (!this.client) {
            this.logger.warn('Brevo client not initialized. Skipping send.');
            return false;
        }

        try {
            const email = new BREVO.SendSmtpEmail();
            email.subject = payload.subject;
            email.htmlContent = payload.body;
            email.sender = { name: 'FalconPay', email: 'no-reply@falconpay.com' };
            email.to = [{ email: to }];

            await this.client.sendTransacEmail(email);
            return true;
        } catch (err) {
            this.logger.error(`Brevo send failed: ${err.message}`);
            return false;
        }
    }
}
