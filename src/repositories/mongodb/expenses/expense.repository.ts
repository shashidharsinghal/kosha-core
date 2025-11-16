import { Expense, IExpense } from '../../../models/mongodb/expenses/expense.schema';

export class ExpenseRepository {
  async create(expenseData: Partial<IExpense>): Promise<IExpense> {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  async findById(id: string): Promise<IExpense | null> {
    return await Expense.findById(id);
  }

  async findByUserId(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
      paymentMethod?: string;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ expenses: IExpense[]; total: number }> {
    const query: any = { userId };

    if (filters.startDate || filters.endDate) {
      query.spentAt = {};
      if (filters.startDate) query.spentAt.$gte = filters.startDate;
      if (filters.endDate) query.spentAt.$lte = filters.endDate;
    }
    if (filters.category) query.category = filters.category;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;

    const sortOptions: any = {};
    if (pagination.sort) {
      const direction = pagination.sort.startsWith('-') ? -1 : 1;
      const field = pagination.sort.replace(/^-/, '');
      sortOptions[field] = direction;
    } else {
      sortOptions.spentAt = -1;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
      Expense.countDocuments(query),
    ]);

    return { expenses, total };
  }

  async getSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ total: number; byCategory: Record<string, number>; byMonth: Record<string, number> }> {
    const query: any = { userId };
    if (startDate || endDate) {
      query.spentAt = {};
      if (startDate) query.spentAt.$gte = startDate;
      if (endDate) query.spentAt.$lte = endDate;
    }

    const expenses = await Expense.find(query);

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    expenses.forEach((exp) => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
      const monthKey = exp.spentAt.toISOString().substring(0, 7); // YYYY-MM
      byMonth[monthKey] = (byMonth[monthKey] || 0) + exp.amount;
    });

    return { total, byCategory, byMonth };
  }

  async update(id: string, updates: Partial<IExpense>): Promise<IExpense | null> {
    return await Expense.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Expense.findByIdAndDelete(id);
  }
}

