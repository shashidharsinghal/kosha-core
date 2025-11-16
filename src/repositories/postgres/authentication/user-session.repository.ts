import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { UserSession } from '../../../models/postgres/authentication/user-session.entity';

export class UserSessionRepository {
  private repository: Repository<UserSession> | null = null;

  private getRepository(): Repository<UserSession> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(UserSession);
    }
    return this.repository;
  }

  async create(sessionData: Partial<UserSession>): Promise<UserSession> {
    const repo = this.getRepository();
    const session = repo.create(sessionData);
    return await repo.save(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return await this.getRepository().findOne({ where: { refreshToken } });
  }

  async findByUserId(userId: string): Promise<UserSession[]> {
    return await this.getRepository().find({ where: { userId } });
  }

  async delete(refreshToken: string): Promise<void> {
    await this.getRepository().delete({ refreshToken });
  }

  async deleteExpired(): Promise<void> {
    await this.getRepository()
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }
}

