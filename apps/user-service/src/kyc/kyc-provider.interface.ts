import { Injectable, Logger } from '@nestjs/common';

export interface IKycProvider {
    name: string;
    verify(userId: string, data: any): Promise<{ status: 'VERIFIED' | 'REJECTED' | 'PENDING'; referenceId: string }>;
}

@Injectable()
export class StubKycProvider implements IKycProvider {
    name = 'STUB_KYC';
    private readonly logger = new Logger(StubKycProvider.name);

    async verify(userId: string, data: any) {
        this.logger.log(`[KYC Provider] Verifying user ${userId}`);
        return { status: 'PENDING' as const, referenceId: `REF-${Date.now()}` };
    }
}
