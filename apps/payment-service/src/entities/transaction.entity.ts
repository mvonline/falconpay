import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderId: string;

    @Column()
    receiverId: string;

    @Column('decimal', { precision: 18, scale: 3 })
    amount: number;

    @Column({ default: 'OMR' })
    currency: string;

    @Column({ default: 'PENDING' })
    status: string; // PENDING, COMPLETED, FAILED

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'A2A_TRANSFER' })
    type: string; // A2A_TRANSFER, QR_PAYMENT, REQUEST_TO_PAY

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
