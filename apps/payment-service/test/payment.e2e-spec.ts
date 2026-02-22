import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PaymentServiceModule } from '../src/payment-service.module';

import { JwtAuthGuard } from '@app/common';
import { ExecutionContext } from '@nestjs/common';

describe('PaymentController (e2e)', () => {
    let app: INestApplication;

    const mockJwtGuard = {
        canActivate: (context: ExecutionContext) => {
            const req = context.switchToHttp().getRequest();
            req.user = { userId: 'test-user-id' };
            return true;
        },
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PaymentServiceModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('/payments/transfer (POST) - Success', () => {
        return request(app.getHttpServer())
            .post('/payments/transfer')
            .send({
                receiverId: 'receiver-uuid',
                amount: 50,
                description: 'E2E Test Transfer'
            })
            .expect(201)
            .then(response => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.status).toBe('PENDING');
            });
    });

    it('/payments/transfer (POST) - Bad Request (Missing Amount)', () => {
        return request(app.getHttpServer())
            .post('/payments/transfer')
            .send({
                receiverId: 'receiver-uuid',
                description: 'E2E Test Transfer'
            })
            .expect(400);
    });

    afterAll(async () => {
        await app.close();
    });
});
