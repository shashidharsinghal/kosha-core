import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('upi_accounts')
export class UPIAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column()
  provider!: string;

  @Column({ name: 'upi_id' })
  upiId!: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  })
  status!: string;

  @Column({ name: 'linked_at' })
  linkedAt!: Date;

  @Column({ type: 'text', nullable: true }) // encrypted
  token?: string;
}

