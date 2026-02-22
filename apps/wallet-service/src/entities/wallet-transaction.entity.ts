import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum WalletTransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

@Entity('wallet_transactions')
@Index(['walletId', 'referenceId'], { unique: true })
export class WalletTransaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    walletId: string;

    @Column('decimal', { precision: 18, scale: 3 })
    amount: number;

    @Column({
        type: 'enum',
        enum: WalletTransactionType,
    })
    type: WalletTransactionType;

    @Column({ nullable: true })
    referenceId: string; // e.g., payment transaction ID

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}
