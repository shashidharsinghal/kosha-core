import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { Asset } from '../../../models/postgres/investments/asset.entity';

export class AssetRepository {
  private repository: Repository<Asset> | null = null;

  private getRepository(): Repository<Asset> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(Asset);
    }
    return this.repository;
  }

  async create(assetData: Partial<Asset>): Promise<Asset> {
    const repo = this.getRepository();
    const asset = repo.create(assetData);
    return await repo.save(asset);
  }

  async findById(id: string): Promise<Asset | null> {
    return await this.getRepository().findOne({ where: { id } });
  }

  async findByUserId(userId: string, type?: string): Promise<Asset[]> {
    const query: any = { userId };
    if (type) query.type = type;
    return await this.getRepository().find({ where: query });
  }

  async update(id: string, updates: Partial<Asset>): Promise<Asset> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Asset not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }
}

