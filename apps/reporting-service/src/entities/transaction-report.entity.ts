import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transaction_reports')
export class TransactionReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    transactionId: string;

    @Column()
    senderId: string;

    @Column()
    receiverId: string;

    @Column('decimal')
    amount: number;

    @Column()
    status: string; // COMPLETED, FAILED, PENDING

    @Column({ nullable: true })
    failureReason: string;

    @CreateDateColumn()
    createdAt: Date;
}
