import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { INotificationProvider, NotificationType } from './providers/provider.interface';
import { EmailProvider, SmsProvider } from './providers/stubs.provider';
import { TwilioProvider } from './providers/twilio.provider';

import { MailgunProvider } from './providers/mailgun.provider';
import { BrevoProvider } from './providers/brevo.provider';
import { RaventrackProvider } from './providers/raventrack.provider';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private providers: Map<NotificationType, INotificationProvider[]> = new Map();

  constructor(
    private readonly twilio: TwilioProvider,
    private readonly mailgun: MailgunProvider,
    private readonly brevo: BrevoProvider,
    private readonly raventrack: RaventrackProvider,
    private readonly smsStub: SmsProvider,
    private readonly emailStub: EmailProvider,
  ) { }

  onModuleInit() {
    this.registerProvider(NotificationType.SMS, this.twilio);
    this.registerProvider(NotificationType.SMS, this.smsStub);
    this.registerProvider(NotificationType.EMAIL, this.mailgun);
    this.registerProvider(NotificationType.EMAIL, this.brevo);
    this.registerProvider(NotificationType.EMAIL, this.emailStub);
    this.registerProvider(NotificationType.ANALYTICS, this.raventrack);
  }

  private registerProvider(type: NotificationType, provider: INotificationProvider) {
    if (!this.providers.has(type)) {
      this.providers.set(type, []);
    }
    this.providers.get(type)!.push(provider);
  }


  async sendNotification(type: NotificationType, to: string, payload: any) {
    const list = this.providers.get(type);
    if (!list || list.length === 0) {
      this.logger.error(`No providers found for type: ${type}`);
      return;
    }

    // For now, send via the first available functional provider
    for (const provider of list) {
      const success = await provider.send(to, payload);
      if (success) return true;
    }
    return false;
  }

  async handleUserCreated(data: { phone: string; userId: string }) {
    this.logger.log(`Handling user created for: ${data.userId}`);

    // Send SMS
    await this.sendNotification(NotificationType.SMS, data.phone, {
      message: 'Welcome to FalconPay! Your account has been created.',
    });

    // Track in Raventrack
    await this.sendNotification(NotificationType.ANALYTICS, data.userId, {
      event: 'registration',
      timestamp: new Date().toISOString(),
      metadata: { userId: data.userId }
    });
  }


  async handlePaymentCompleted(data: { transactionId: string; senderId: string; amount: number }) {
    this.logger.log(`Handling payment completion: ${data.transactionId}`);
    // In a real app, you'd fetch user preferences and contact info from User Service
    await this.sendNotification(NotificationType.PUSH, data.senderId, {
      title: 'Payment Sent',
      message: `Your payment of ${data.amount} OMR was successful.`,
    });
  }
}
