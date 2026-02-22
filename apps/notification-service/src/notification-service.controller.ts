import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification-service.service';
import { KafkaTopics } from '@app/common';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) { }

  @MessagePattern(KafkaTopics.USER_CREATED)
  async handleUserCreated(@Payload() data: any) {
    return this.notificationService.handleUserCreated(data);
  }

  @MessagePattern(KafkaTopics.PAYMENT_COMPLETED)
  async handlePaymentCompleted(@Payload() data: any) {
    return this.notificationService.handlePaymentCompleted(data);
  }
}
