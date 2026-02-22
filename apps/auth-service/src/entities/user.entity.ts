import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    twoFactorSecret: string;

    @Column({ default: false })
    isTwoFactorEnabled: boolean;

    @CreateDateColumn()

    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
