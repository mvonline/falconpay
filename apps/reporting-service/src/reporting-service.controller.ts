import { Controller, Get, Query, Response } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReportingServiceService } from './reporting-service.service';

@Controller('reporting')
export class ReportingServiceController {
  constructor(private readonly reportingService: ReportingServiceService) { }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(@Payload() data: any) {
    return this.reportingService.handlePaymentCompleted(data);
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() data: any) {
    return this.reportingService.handlePaymentFailed(data);
  }

  @Get('stats')
  async getStats(@Query() filters: any) {
    return this.reportingService.getTransactionStats(filters);
  }

  @Get('export/csv')
  async exportCsv(@Query() filters: any, @Response() res: any) {
    const csv = await this.reportingService.exportToCsv(filters);
    res.set('Content-Type', 'text/csv');
    res.attachment('falconpay-report.csv');
    return res.send(csv);
  }
}

