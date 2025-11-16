import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { UPIAccount } from '../../../models/postgres/payments/upi-account.entity';

export class UPIAccountRepository {
  private repository: Repository<UPIAccount> | null = null;

  private getRepository(): Repository<UPIAccount> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(UPIAccount);
    }
    return this.repository;
  }

  async create(accountData: Partial<UPIAccount>): Promise<UPIAccount> {
    const repo = this.getRepository();
    const account = repo.create(accountData);
    return await repo.save(account);
  }

  async findById(id: string): Promise<UPIAccount | null> {
    return await this.getRepository().findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<UPIAccount[]> {
    return await this.getRepository().find({ where: { userId } });
  }

  async findActiveByUserId(userId: string): Promise<UPIAccount[]> {
    return await this.getRepository().find({ where: { userId, status: 'ACTIVE' } });
  }

  async update(id: string, updates: Partial<UPIAccount>): Promise<UPIAccount> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('UPI Account not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }
}

