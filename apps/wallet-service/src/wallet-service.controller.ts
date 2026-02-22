import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WalletService } from './wallet-service.service';
import { KafkaTopics, JwtAuthGuard } from '@app/common';

@Controller('wallets')
export class WalletServiceController {
  constructor(private readonly walletService: WalletService) { }

  @MessagePattern(KafkaTopics.USER_CREATED)
  async handleUserCreated(@Payload() data: { userId: string }) {
    return this.walletService.createPersonalWallet(data.userId);
  }

  @MessagePattern(KafkaTopics.PAYMENT_CREATED)
  async handlePaymentCreated(@Payload() data: any) {
    return this.walletService.handlePaymentCreated(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Request() req) {
    const balance = await this.walletService.getBalance(req.user.userId);
    return { balance, currency: 'OMR' };
  }
}
