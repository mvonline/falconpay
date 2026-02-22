import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INotificationProvider, NotificationType } from './provider.interface';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioProvider implements INotificationProvider {
    private readonly logger = new Logger(TwilioProvider.name);
    private client: Twilio.Twilio;
    type = NotificationType.SMS;

    constructor(private readonly configService: ConfigService) {
        const sid = this.configService.get<string>('TWILIO_SID');
        const token = this.configService.get<string>('TWILIO_TOKEN');

        if (sid && token) {
            this.client = Twilio(sid, token);
        }
    }

    async send(to: string, payload: { message: string }): Promise<boolean> {
        if (!this.client) {
            this.logger.warn('Twilio client not initialized. Skipping send.');
            return false;
        }

        try {
            await this.client.messages.create({
                body: payload.message,
                from: this.configService.get<string>('TWILIO_PHONE'),
                to,
            });
            return true;
        } catch (err) {
            this.logger.error(`Twilio send failed: ${err.message}`);
            return false;
        }
    }
}
