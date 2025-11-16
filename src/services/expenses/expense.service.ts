import { ExpenseRepository } from '../../repositories/mongodb/expenses/expense.repository';
import { AppError } from '../../middleware/errorHandler';
import { IExpense } from '../../models/mongodb/expenses/expense.schema';

export class ExpenseService {
  private expenseRepository: ExpenseRepository;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async addExpense(userId: string, expenseData: Partial<IExpense>): Promise<IExpense> {
    return await this.expenseRepository.create({ ...expenseData, userId });
  }

  async updateExpense(expenseId: string, userId: string, updates: Partial<IExpense>): Promise<IExpense> {
    const expense = await this.expenseRepository.findById(expenseId);
    if (!expense) {
      throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found');
    }
    if (expense.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update expense belonging to another user');
    }

    const updated = await this.expenseRepository.update(expenseId, updates);
    if (!updated) {
      throw new AppError(500, 'UPDATE_FAILED', 'Failed to update expense');
    }
    return updated;
  }

  async listExpenses(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
      paymentMethod?: string;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ expenses: IExpense[]; total: number; page: number; limit: number }> {
    const { expenses, total } = await this.expenseRepository.findByUserId(userId, filters, pagination);
    return { expenses, total, page: pagination.page, limit: pagination.limit };
  }

  async deleteExpense(expenseId: string, userId: string): Promise<{ success: boolean }> {
    const expense = await this.expenseRepository.findById(expenseId);
    if (!expense) {
      throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found');
    }
    if (expense.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete expense belonging to another user');
    }

    await this.expenseRepository.delete(expenseId);
    return { success: true };
  }

  async importExpenses(
    userId: string,
    source: 'UPI' | 'CARD' | 'SMS'
  ): Promise<{ imported: number; failed: number }> {
    // TODO: Implement import logic from external sources
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
  ): Promise<{ total: number; byCategory: Record<string, number>; byMonth: Record<string, number>; burnRate: number }> {
    const summary = await this.expenseRepository.getSummary(userId, startDate, endDate);
    
    // Calculate burn rate (expenses per day)
    const days = startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    const burnRate = summary.total / days;

    return { ...summary, burnRate };
  }
}

