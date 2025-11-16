import { IncomeRepository } from '../../repositories/mongodb/income/income.repository';
import { AppError } from '../../middleware/errorHandler';
import { IIncome } from '../../models/mongodb/income/income.schema';

export class IncomeService {
  private incomeRepository: IncomeRepository;

  constructor() {
    this.incomeRepository = new IncomeRepository();
  }

  async addIncome(userId: string, incomeData: Partial<IIncome>): Promise<IIncome> {
    return await this.incomeRepository.create({ ...incomeData, userId });
  }

  async updateIncome(incomeId: string, userId: string, updates: Partial<IIncome>): Promise<IIncome> {
    const income = await this.incomeRepository.findById(incomeId);
    if (!income) {
      throw new AppError(404, 'INCOME_NOT_FOUND', 'Income not found');
    }
    if (income.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update income belonging to another user');
    }

    const updated = await this.incomeRepository.update(incomeId, updates);
    if (!updated) {
      throw new AppError(500, 'UPDATE_FAILED', 'Failed to update income');
    }
    return updated;
  }

  async listIncomes(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ incomes: IIncome[]; total: number; page: number; limit: number }> {
    const { incomes, total } = await this.incomeRepository.findByUserId(userId, filters, pagination);
    return { incomes, total, page: pagination.page, limit: pagination.limit };
  }

  async deleteIncome(incomeId: string, userId: string): Promise<{ success: boolean }> {
    const income = await this.incomeRepository.findById(incomeId);
    if (!income) {
      throw new AppError(404, 'INCOME_NOT_FOUND', 'Income not found');
    }
    if (income.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete income belonging to another user');
    }

    await this.incomeRepository.delete(incomeId);
    return { success: true };
  }

  async importIncomes(userId: string): Promise<{ imported: number; failed: number }> {
    // TODO: Implement Gmail import for payroll emails
    let imported = 0;
    let failed = 0;

    // Placeholder implementation
    try {
      // Simulate import process
      imported = 0;
      failed = 0;
    } catch (error) {
      failed++;
    }

    return { imported, failed };
  }

  async getSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ total: number; byCategory: Record<string, number>; byMonth: Record<string, number> }> {
    return await this.incomeRepository.getSummary(userId, startDate, endDate);
  }
}

