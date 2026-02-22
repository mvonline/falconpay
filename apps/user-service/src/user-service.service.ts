import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { IKycProvider, StubKycProvider } from './kyc/kyc-provider.interface';

@Injectable()
export class UserServiceService {
  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly kycProvider: StubKycProvider,
  ) { }

  async createProfile(data: { userId: string; phone: string; email?: string; fullName?: string }) {
    this.logger.log(`Creating profile for user: ${data.userId}`);
    const profile = this.profileRepository.create({
      userId: data.userId,
      fullName: data.fullName,
    });
    return this.profileRepository.save(profile);
  }

  async getProfile(userId: string) {
    return this.profileRepository.findOne({ where: { userId } });
  }

  async initiateKyc(userId: string, kycData: any) {
    const result = await this.kycProvider.verify(userId, kycData);
    await this.profileRepository.update({ userId }, {
      verificationStatus: result.status,
    });
    return result;
  }
}


