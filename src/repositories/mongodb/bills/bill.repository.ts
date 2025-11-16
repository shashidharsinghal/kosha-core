import { Bill, IBill } from '../../../models/mongodb/bills/bill.schema';

export class BillRepository {
  async create(billData: Partial<IBill>): Promise<IBill> {
    const bill = new Bill(billData);
    return await bill.save();
  }

  async findById(id: string): Promise<IBill | null> {
    return await Bill.findById(id);
  }

  async findByUserId(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ bills: IBill[]; total: number }> {
    const query: any = { userId };

    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.startDate || filters.endDate) {
      query.dueDate = {};
      if (filters.startDate) query.dueDate.$gte = filters.startDate;
      if (filters.endDate) query.dueDate.$lte = filters.endDate;
    }

    const sortOptions: any = {};
    if (pagination.sort) {
      const direction = pagination.sort.startsWith('-') ? -1 : 1;
      const field = pagination.sort.replace(/^-/, '');
      sortOptions[field] = direction;
    } else {
      sortOptions.dueDate = 1;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [bills, total] = await Promise.all([
      Bill.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
      Bill.countDocuments(query),
    ]);

    return { bills, total };
  }

  async findUpcoming(userId: string, days: number = 30): Promise<IBill[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await Bill.find({
      userId,
      dueDate: { $gte: startDate, $lte: endDate },
      status: { $ne: 'PAID' },
    }).sort({ dueDate: 1 });
  }

  async update(id: string, updates: Partial<IBill>): Promise<IBill | null> {
    return await Bill.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Bill.findByIdAndDelete(id);
  }

  async findRecurringPatterns(userId: string): Promise<IBill[]> {
    // Find bills that appear regularly (same provider, similar amount, monthly)
    const bills = await Bill.find({ userId, source: { $ne: 'MANUAL' } });
    // TODO: Implement pattern detection logic
    return bills;
  }
}

