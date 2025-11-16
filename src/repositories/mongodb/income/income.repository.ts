import { Income, IIncome } from '../../../models/mongodb/income/income.schema';

export class IncomeRepository {
  async create(incomeData: Partial<IIncome>): Promise<IIncome> {
    const income = new Income(incomeData);
    return await income.save();
  }

  async findById(id: string): Promise<IIncome | null> {
    return await Income.findById(id);
  }

  async findByUserId(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ incomes: IIncome[]; total: number }> {
    const query: any = { userId };

    if (filters.startDate || filters.endDate) {
      query.receivedAt = {};
      if (filters.startDate) query.receivedAt.$gte = filters.startDate;
      if (filters.endDate) query.receivedAt.$lte = filters.endDate;
    }
    if (filters.category) query.category = filters.category;

    const sortOptions: any = {};
    if (pagination.sort) {
      const direction = pagination.sort.startsWith('-') ? -1 : 1;
      const field = pagination.sort.replace(/^-/, '');
      sortOptions[field] = direction;
    } else {
      sortOptions.receivedAt = -1;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [incomes, total] = await Promise.all([
      Income.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
      Income.countDocuments(query),
    ]);

    return { incomes, total };
  }

  async getSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ total: number; byCategory: Record<string, number>; byMonth: Record<string, number> }> {
    const query: any = { userId };
    if (startDate || endDate) {
      query.receivedAt = {};
      if (startDate) query.receivedAt.$gte = startDate;
      if (endDate) query.receivedAt.$lte = endDate;
    }

    const incomes = await Income.find(query);

    const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const byCategory: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    incomes.forEach((inc) => {
      const category = inc.category || 'Uncategorized';
      byCategory[category] = (byCategory[category] || 0) + inc.amount;
      const monthKey = inc.receivedAt.toISOString().substring(0, 7);
      byMonth[monthKey] = (byMonth[monthKey] || 0) + inc.amount;
    });

    return { total, byCategory, byMonth };
  }

  async update(id: string, updates: Partial<IIncome>): Promise<IIncome | null> {
    return await Income.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Income.findByIdAndDelete(id);
  }
}

