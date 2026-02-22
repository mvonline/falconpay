import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AccountType {
    BANK = 'BANK',
    INTERNAL = 'INTERNAL',
}

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string; // e.g., "Main Savings", "Work Account"

    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.INTERNAL,
    })
    type: AccountType;

    @Column({ nullable: true })
    bankName: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
