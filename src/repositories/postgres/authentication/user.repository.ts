import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { User } from '../../../models/postgres/authentication/user.entity';

export class UserRepository {
  private repository: Repository<User> | null = null;

  private getRepository(): Repository<User> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(User);
    }
    return this.repository;
  }

  async create(userData: Partial<User>): Promise<User> {
    const repo = this.getRepository();
    const user = repo.create(userData);
    return await repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.getRepository().findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.getRepository().findOne({ where: { id } });
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }
}

