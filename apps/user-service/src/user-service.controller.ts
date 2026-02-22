import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserServiceService } from './user-service.service';
import { KafkaTopics, JwtAuthGuard } from '@app/common';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) { }

  @MessagePattern(KafkaTopics.USER_CREATED)
  async handleUserCreated(@Payload() data: { userId: string; phone: string }) {
    return this.userService.createProfile(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }
}

