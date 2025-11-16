import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column()
  symbol!: string;

  @Column({
    type: 'enum',
    enum: ['MUTUAL_FUND', 'STOCK', 'FIXED_DEPOSIT', 'BOND', 'GOLD', 'CRYPTO', 'OTHER'],
  })
  type!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  institution?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

