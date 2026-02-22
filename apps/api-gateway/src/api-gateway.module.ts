import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SharedConfigModule } from '@app/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthMiddleware } from './auth.middleware';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  imports: [SharedConfigModule.register('./apps/api-gateway/.env')],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, ProxyMiddleware)
      .forRoutes('*');
  }
}


