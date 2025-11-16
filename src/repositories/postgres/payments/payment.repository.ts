import { Repository } from 'typeorm';
import { getPostgresConnection } from '../../../config/database';
import { Payment } from '../../../models/postgres/payments/payment.entity';

export class PaymentRepository {
  private repository: Repository<Payment> | null = null;

  private getRepository(): Repository<Payment> {
    if (!this.repository) {
      this.repository = getPostgresConnection().getRepository(Payment);
    }
    return this.repository;
  }

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const repo = this.getRepository();
    const payment = repo.create(paymentData);
    return await repo.save(payment);
  }

  async findById(id: string): Promise<Payment | null> {
    return await this.getRepository().findOne({ where: { id } });
  }

  async findByUserId(
    userId: string,
    filters: {
      billId?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ payments: Payment[]; total: number }> {
    const queryBuilder = this.getRepository()
      .createQueryBuilder('payment')
      .where('payment.userId = :userId', { userId });

    if (filters.billId) {
      queryBuilder.andWhere('payment.billId = :billId', { billId: filters.billId });
    }
    if (filters.status) {
      queryBuilder.andWhere('payment.status = :status', { status: filters.status });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('payment.initiatedAt >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('payment.initiatedAt <= :endDate', { endDate: filters.endDate });
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [payments, total] = await Promise.all([
      queryBuilder
        .orderBy('payment.initiatedAt', 'DESC')
        .skip(skip)
        .take(pagination.limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return { payments, total };
  }

  async update(id: string, updates: Partial<Payment>): Promise<Payment> {
    await this.getRepository().update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Payment not found after update');
    return updated;
  }
}

