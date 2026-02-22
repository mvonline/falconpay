import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { KafkaTopics, ServiceNames } from '@app/common';
import { TwoFactorService } from './two-factor.service';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(ServiceNames.AUTH)
    private readonly kafkaClient: ClientKafka,
    private readonly tfaService: TwoFactorService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { phone, password, email, firstName, lastName } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ phone }, { email }]
    });
    if (existingUser) {
      throw new ConflictException('User with this phone or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      phone,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Publish event to Kafka with profile info
    this.kafkaClient.emit(KafkaTopics.USER_CREATED, {
      userId: savedUser.id,
      phone: savedUser.phone,
      email: savedUser.email,
      fullName: `${firstName} ${lastName}`.trim(),
    });

    return {
      message: 'User registered successfully',
      userId: savedUser.id,
    };
  }

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ phone: identifier }, { email: identifier }]
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    if (user.isTwoFactorEnabled) {
      return {
        mfaRequired: true,
        mfaToken: this.jwtService.sign({ sub: user.id, isMfaPending: true }, { expiresIn: '5m' }),
      };
    }

    const payload = { sub: user.id, phone: user.phone };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTwoFactorSecret(user: User) {
    const secret = this.tfaService.generateSecret();
    const otpUri = this.tfaService.generateOtpUri(secret, user.phone);
    const qrCode = await this.tfaService.generateQrCode(otpUri);

    await this.userRepository.update(user.id, { twoFactorSecret: secret });

    return { secret, qrCode };
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new ConflictException('2FA setup not initiated');
    }

    const isValid = this.tfaService.verifyCode(code, user.twoFactorSecret);
    if (!isValid) {
      throw new ConflictException('Invalid 2FA code');
    }

    await this.userRepository.update(userId, { isTwoFactorEnabled: true });
    return { success: true };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new ConflictException('2FA not enabled');
    }

    const isValid = this.tfaService.verifyCode(code, user.twoFactorSecret);
    if (!isValid) {
      throw new ConflictException('Invalid 2FA code');
    }

    const payload = { sub: user.id, phone: user.phone };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}



