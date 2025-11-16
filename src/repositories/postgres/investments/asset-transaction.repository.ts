import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { AssetTransaction } from '../../../models/postgres/investments/asset-transaction.entity';

export class AssetTransactionRepository {
  private repository: Repository<AssetTransaction> | null = null;

  private getRepository(): Repository<AssetTransaction> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(AssetTransaction);
    }
    return this.repository;
  }

  async create(transactionData: Partial<AssetTransaction>): Promise<AssetTransaction> {
    const repo = this.getRepository();
    const transaction = repo.create(transactionData);
    return await repo.save(transaction);
  }

  async findById(id: string): Promise<AssetTransaction | null> {
    return await this.getRepository().findOne({ where: { id }, relations: ['asset'] });
  }

  async findByAssetId(assetId: string): Promise<AssetTransaction[]> {
    return await this.getRepository().find({
      where: { assetId },
      order: { transactionDate: 'DESC' },
    });
  }

  async findByUserId(
    userId: string,
    filters: {
      assetId?: string;
      startDate?: Date;
      endDate?: Date;
      transactionType?: 'BUY' | 'SELL';
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ transactions: AssetTransaction[]; total: number }> {
    const queryBuilder = this.getRepository()
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (filters.assetId) {
      queryBuilder.andWhere('transaction.assetId = :assetId', { assetId: filters.assetId });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('transaction.transactionDate >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('transaction.transactionDate <= :endDate', { endDate: filters.endDate });
    }
    if (filters.transactionType) {
      queryBuilder.andWhere('transaction.transactionType = :type', { type: filters.transactionType });
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [transactions, total] = await Promise.all([
      queryBuilder
        .orderBy('transaction.transactionDate', 'DESC')
        .skip(skip)
        .take(pagination.limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return { transactions, total };
  }

  async update(id: string, updates: Partial<AssetTransaction>): Promise<AssetTransaction> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Transaction not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }

  async getHoldings(assetId: string): Promise<{ totalUnits: number; averageCost: number }> {
    const transactions = await this.findByAssetId(assetId);
    let totalUnits = 0;
    let totalCost = 0;

    transactions.forEach((tx) => {
      if (tx.transactionType === 'BUY') {
        totalUnits += Number(tx.units);
        totalCost += Number(tx.totalAmount);
      } else {
        totalUnits -= Number(tx.units);
        totalCost -= Number(tx.totalAmount);
      }
    });

    const averageCost = totalUnits > 0 ? totalCost / totalUnits : 0;
    return { totalUnits, averageCost };
  }
}

