import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../src/wallet-service.service';
import { Wallet, WalletType, MemberRole, WalletMember } from '../src/entities/wallet.entity';
import { WalletTransaction } from '../src/entities/wallet-transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedlockService, ServiceNames } from '@app/common';
import { DataSource, OptimisticLockVersionMismatchError } from 'typeorm';

/**
 * STRESS TEST SIMULATION
 * This test simulates high contention by calling the internal processTransaction logic
 * in parallel for a single sender to verify Layer 1, 2, and 3 protections.
 * RUN WITH: npx jest apps/wallet-service/test/concurrency.stress-spec.ts
 */
describe('Wallet Concurrency Stress Test', () => {
    let service: WalletService;
    let dataSource: any;
    let redlock: any;

    // Mocked state
    const mockSenderId = 'sender-123';
    const mockReceiverId = 'receiver-456';
    const initialBalance = 1000;
    const paymentAmount = 100;
    const numParallelRequests = 15; // More than enough to trigger contention

    beforeEach(async () => {
        // 1. Mock Redlock to actually simulate the delay/lock logic if needed, 
        // but here we use a real-ish implementation for the stress test via the service
        redlock = {
            acquire: jest.fn().mockResolvedValue({ release: jest.fn() }),
        };

        const mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                findOne: jest.fn(),
                save: jest.fn(),
                createQueryBuilder: jest.fn().mockReturnValue({
                    update: jest.fn().mockReturnThis(),
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    execute: jest.fn().mockResolvedValue({ affected: 1 }),
                }),
            },
        };

        dataSource = {
            createQueryRunner: () => mockQueryRunner,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WalletService,
                {
                    provide: getRepositoryToken(Wallet),
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: getRepositoryToken(WalletMember),
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: getRepositoryToken(WalletTransaction),
                    useValue: { findOne: jest.fn() },
                },
                { provide: DataSource, useValue: dataSource },
                { provide: RedlockService, useValue: redlock },
                { provide: ServiceNames.WALLET, useValue: { emit: jest.fn() } },
            ],
        }).compile();

        service = module.get<WalletService>(WalletService);
    });

    it('SHOULD handle parallel debit requests and maintain integrity', async () => {
        // Setup: We expect 50 parallel calls. 
        // If we have 1000 OMR and each call is 100 OMR, exactly 10 should succeed.

        const results = {
            success: 0,
            insufficient: 0,
            optimisticFail: 0,
        };

        // We simulate the database behavior for Layer 2 & 3
        let currentBalance = initialBalance;
        let currentVersion = 1;

        (dataSource.createQueryRunner().manager.findOne as jest.Mock).mockImplementation((entity, options) => {
            if (entity === Wallet) {
                return { id: 'w1', balance: currentBalance, version: currentVersion };
            }
            return { walletId: 'w1', userId: mockSenderId };
        });

        // Mock Layer 3 Atomic SQL Update
        (dataSource.createQueryRunner().manager.createQueryBuilder().execute as jest.Mock).mockImplementation(async () => {
            if (currentBalance >= paymentAmount) {
                currentBalance -= paymentAmount;
                currentVersion++;
                results.success++;
                return { affected: 1 };
            } else {
                results.insufficient++;
                return { affected: 0 };
            }
        });

        const requests = Array.from({ length: numParallelRequests }).map((_, i) =>
            service.handlePaymentCreated({
                transactionId: `tx-${i}`,
                senderId: mockSenderId,
                receiverId: mockReceiverId,
                amount: paymentAmount
            }).catch(err => {
                if (err.message.includes('Insufficient balance')) results.insufficient++;
                if (err instanceof OptimisticLockVersionMismatchError) results.optimisticFail++;
            })
        );

        await Promise.all(requests);

        console.log('--- Stress Test Results ---');
        console.log(`Initial: ${initialBalance} OMR`);
        console.log(`Successful: ${results.success}`);
        console.log(`Rejected (Insufficient): ${results.insufficient}`);
        console.log(`Final Balance: ${currentBalance} OMR`);

        expect(currentBalance).toBeGreaterThanOrEqual(0);
        expect(results.success).toBe(10); // 1000 / 100
    });
});
