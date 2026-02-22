import { Module } from '@nestjs/common';
import { KafkaModule, ServiceNames, SharedConfigModule } from '@app/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationService } from './notification-service.service';

import { EmailProvider, SmsProvider, PushProvider } from './providers/stubs.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { MailgunProvider } from './providers/mailgun.provider';
import { BrevoProvider } from './providers/brevo.provider';
import { RaventrackProvider } from './providers/raventrack.provider';

@Module({
  imports: [
    SharedConfigModule.register('./apps/notification-service/.env'),
    KafkaModule.register(ServiceNames.NOTIFICATION),
  ],
  controllers: [NotificationServiceController],
  providers: [
    NotificationService,
    EmailProvider,
    SmsProvider,
    PushProvider,
    TwilioProvider,
    MailgunProvider,
    BrevoProvider,
    RaventrackProvider,
  ],
})
export class NotificationServiceModule { }

