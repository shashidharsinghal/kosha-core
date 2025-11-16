import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { Mandate } from '../../../models/postgres/payments/mandate.entity';

export class MandateRepository {
  private repository: Repository<Mandate> | null = null;

  private getRepository(): Repository<Mandate> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(Mandate);
    }
    return this.repository;
  }

  async create(mandateData: Partial<Mandate>): Promise<Mandate> {
    const repo = this.getRepository();
    const mandate = repo.create(mandateData);
    return await repo.save(mandate);
  }

  async findById(id: string): Promise<Mandate | null> {
    return await this.getRepository().findOne({ where: { id } });
  }

  async findByUserId(userId: string, status?: string): Promise<Mandate[]> {
    const query: any = { userId };
    if (status) query.status = status;
    return await this.getRepository().find({ where: query });
  }

  async findActiveMandates(): Promise<Mandate[]> {
    return await this.getRepository().find({
      where: { status: 'ACTIVE' },
      order: { nextDueDate: 'ASC' },
    });
  }

  async update(id: string, updates: Partial<Mandate>): Promise<Mandate> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Mandate not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }
}

