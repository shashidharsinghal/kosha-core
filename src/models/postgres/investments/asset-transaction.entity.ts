import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('asset_transactions')
export class AssetTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'asset_id' })
  assetId!: string;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'transaction_date' })
  transactionDate!: Date;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: ['BUY', 'SELL'],
  })
  transactionType!: 'BUY' | 'SELL';

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  units!: number;

  @Column({ name: 'price_per_unit', type: 'decimal', precision: 18, scale: 2 })
  pricePerUnit!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  fees!: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

