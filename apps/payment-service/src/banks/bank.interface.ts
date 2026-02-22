import { Injectable } from '@nestjs/common';

export interface IBankProvider {

    bankCode: string;
    getBalance(accountNumber: string): Promise<number>;
    transfer(from: string, to: string, amount: number): Promise<boolean>;
}

@Injectable()
export class StubBankProvider implements IBankProvider {
    bankCode = 'STUB_BANK';
    async getBalance(accountNumber: string) { return 1000; }
    async transfer(from: string, to: string, amount: number) { return true; }
}
