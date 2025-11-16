import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mandates')
export class Mandate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'bill_id' })
  billId!: string;

  @Column({ name: 'upi_account_id' })
  upiAccountId!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: ['MONTHLY', 'YEARLY', 'WEEKLY'],
  })
  frequency!: string;

  @Column({ name: 'next_due_date' })
  nextDueDate!: Date;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'PAUSED', 'CANCELLED'],
    default: 'ACTIVE',
  })
  status!: string;

  @Column({ name: 'provider_mandate_id', nullable: true })
  providerMandateId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

