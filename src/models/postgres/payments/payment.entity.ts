import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'bill_id', nullable: true })
  billId?: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: number;

  @Column({ name: 'paid_at', nullable: true })
  paidAt?: Date;

  @Column({ name: 'initiated_at' })
  initiatedAt!: Date;

  @Column({
    type: 'enum',
    enum: ['UPI', 'CARD', 'NETBANKING'],
  })
  method!: string;

  @Column({
    type: 'enum',
    enum: ['INITIATED', 'PENDING', 'SUCCESS', 'FAILED'],
    default: 'INITIATED',
  })
  status!: string;

  @Column({ name: 'transaction_reference', nullable: true })
  transactionReference?: string;

  @Column({ name: 'upi_account_id', nullable: true })
  upiAccountId?: string;

  @Column({ name: 'error_code', nullable: true })
  errorCode?: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;
}

