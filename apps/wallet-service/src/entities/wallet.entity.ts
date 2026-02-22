import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum WalletType {
    PERSONAL = 'PERSONAL',
    SHARED = 'SHARED',
}

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string; // e.g., "Family Fund", "Home Expenses"

    @Column('decimal', { precision: 18, scale: 3, default: 0 })
    balance: number;

    @Column({ default: 'OMR' })
    currency: string;

    @Column({
        type: 'enum',
        enum: WalletType,
        default: WalletType.PERSONAL,
    })
    type: WalletType;

    @OneToMany(() => WalletMember, (member) => member.wallet)
    members: WalletMember[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export enum MemberRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

@Entity('wallet_members')
export class WalletMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    walletId: string;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: MemberRole,
        default: MemberRole.MEMBER,
    })
    role: MemberRole;

    @Column({ name: 'walletId' })
    wallet: Wallet;

    @CreateDateColumn()
    createdAt: Date;
}
