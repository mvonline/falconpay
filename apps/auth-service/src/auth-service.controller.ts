import { Controller, Post, Body, UseGuards, Request, Get, Param, ConflictException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import { RegisterDto } from './dto/register.dto';
import { KafkaTopics, LocalAuthGuard, JwtAuthGuard } from '@app/common';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) { }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: { accessToken: string }) {
    try {
      const payload = await this.authService.verifyToken(data.accessToken);
      return { valid: true, userId: payload.sub, email: payload.email };
    } catch (e) {
      return { valid: false };
    }
  }


  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate2fa(@Request() req) {
    const user = await this.authService.getUserById(req.user.userId);
    if (!user) {
      throw new ConflictException('User not found');
    }
    return this.authService.generateTwoFactorSecret(user);
  }


  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turnOn2fa(@Request() req, @Body('code') code: string) {
    return this.authService.enableTwoFactor(req.user.userId, code);
  }

  @Post('2fa/verify')
  async verify2fa(@Body() body: { userId: string; code: string }) {
    return this.authService.verifyTwoFactor(body.userId, body.code);
  }
}


