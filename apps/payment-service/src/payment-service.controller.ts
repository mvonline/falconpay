import { Controller, Post, Body, Get, Param, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentServiceService } from './payment-service.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { KafkaTopics, JwtAuthGuard, CircuitBreakerInterceptor } from '@app/common';

@Controller('payments')
@UseInterceptors(CircuitBreakerInterceptor)
export class PaymentServiceController {

  constructor(private readonly paymentService: PaymentServiceService) { }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async createTransfer(@Request() req, @Body() createTransferDto: CreateTransferDto) {
    return this.paymentService.createTransfer(req.user.userId, createTransferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.paymentService.getTransaction(id);
  }

  @MessagePattern(KafkaTopics.WALLET_DEBITED)
  async handleWalletDebited(@Payload() data: { transactionId: string }) {
    return this.paymentService.updateTransactionStatus(data.transactionId, 'COMPLETED');
  }

  @MessagePattern(KafkaTopics.PAYMENT_FAILED)
  async handlePaymentFailed(@Payload() data: { transactionId: string }) {
    return this.paymentService.updateTransactionStatus(data.transactionId, 'FAILED');
  }
}

