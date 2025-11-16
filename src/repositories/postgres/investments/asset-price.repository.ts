import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { AssetPrice } from '../../../models/postgres/investments/asset-price.entity';

export class AssetPriceRepository {
  private repository: Repository<AssetPrice> | null = null;

  private getRepository(): Repository<AssetPrice> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(AssetPrice);
    }
    return this.repository;
  }

  async create(priceData: Partial<AssetPrice>): Promise<AssetPrice> {
    const repo = this.getRepository();
    const price = repo.create(priceData);
    return await repo.save(price);
  }

  async findLatest(symbol: string): Promise<AssetPrice | null> {
    return await this.getRepository().findOne({
      where: { symbol },
      order: { date: 'DESC' },
    });
  }

  async findHistory(
    symbol: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ date: Date; price: number }[]> {
    const queryBuilder = this.getRepository()
      .createQueryBuilder('price')
      .where('price.symbol = :symbol', { symbol })
      .orderBy('price.date', 'ASC');

    if (startDate) {
      queryBuilder.andWhere('price.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('price.date <= :endDate', { endDate });
    }

    const prices = await queryBuilder.getMany();
    return prices.map((p) => ({ date: p.date, price: Number(p.price) }));
  }

  async upsertPrice(symbol: string, price: number, date: Date, source?: string): Promise<AssetPrice> {
    const repo = this.getRepository();
    const existing = await repo.findOne({
      where: { symbol, date },
    });

    if (existing) {
      existing.price = price;
      if (source) existing.source = source;
      return await repo.save(existing);
    }

    return await this.create({ symbol, price, date, source });
  }
}

