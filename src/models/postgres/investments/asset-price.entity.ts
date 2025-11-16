import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('asset_prices')
@Index(['symbol', 'date'])
export class AssetPrice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  symbol!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price!: number;

  @Column()
  date!: Date;

  @Column({ nullable: true })
  source?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

