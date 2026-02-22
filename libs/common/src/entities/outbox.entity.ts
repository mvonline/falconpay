import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OutboxStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

@Entity('outbox')
export class Outbox {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    topic: string;

    @Column('jsonb')
    payload: any;

    @Column({
        type: 'enum',
        enum: OutboxStatus,
        default: OutboxStatus.PENDING,
    })
    status: OutboxStatus;

    @Column({ default: 0 })
    retryCount: number;

    @Column({ nullable: true })
    error: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
