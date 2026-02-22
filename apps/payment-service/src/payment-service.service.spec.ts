import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentServiceService } from '../payment-service.service';
import { Transaction } from '../entities/transaction.entity';
import { DataSource } from 'typeorm';
import { KafkaTopics, ServiceNames, OutboxStatus } from '@app/common';

const mockTransaction = {
    id: 'tx-1',
    senderId: 'user-1',
    receiverId: 'user-2',
    amount: 100,
    status: 'PENDING',
};

const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
        create: jest.fn().mockImplementation((entity, data) => data),
        save: jest.fn().mockImplementation((data) => ({ ...data, id: 'saved-id' })),
    },
};

const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

describe('PaymentServiceService', () => {
    let service: PaymentServiceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentServiceService,
                {
                    provide: getRepositoryToken(Transaction),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: ServiceNames.PAYMENT,
                    useValue: {
                        emit: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<PaymentServiceService>(PaymentServiceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createTransfer', () => {
        it('should create a transaction and an outbox message atomically', async () => {
            const dto = { receiverId: 'user-2', amount: 100, description: 'Test' };
            const userId = 'user-1';

            const result = await service.createTransfer(userId, dto);

            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2); // One for Tx, one for Outbox
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(result.id).toBe('saved-id');
        });

        it('should rollback transaction on error', async () => {
            mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('DB Error'));
            const dto = { receiverId: 'user-2', amount: 100, description: 'Test' };

            await expect(service.createTransfer('user-1', dto)).rejects.toThrow('DB Error');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });
});
