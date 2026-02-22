import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    userId: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: 'PENDING' })
    verificationStatus: string; // PENDING, VERIFIED, REJECTED

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
