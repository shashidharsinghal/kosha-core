import { BillRepository } from '../../repositories/mongodb/bills/bill.repository';
import { AppError } from '../../middleware/errorHandler';
import { IBill } from '../../models/mongodb/bills/bill.schema';

export class BillService {
  private billRepository: BillRepository;

  constructor() {
    this.billRepository = new BillRepository();
  }

  async upsertBill(userId: string, billData: Partial<IBill>): Promise<IBill> {
    if (billData.id) {
      const existing = await this.billRepository.findById(billData.id);
      if (existing && existing.userId !== userId) {
        throw new AppError(403, 'FORBIDDEN', 'Cannot update bill belonging to another user');
      }
      if (existing) {
        return await this.billRepository.update(billData.id, { ...billData, userId }) || existing;
      }
    }

    return await this.billRepository.create({ ...billData, userId });
  }

  async listBills(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number; sort?: string } = { page: 1, limit: 20 }
  ): Promise<{ bills: IBill[]; total: number; page: number; limit: number }> {
    const { bills, total } = await this.billRepository.findByUserId(userId, filters, pagination);
    return { bills, total, page: pagination.page, limit: pagination.limit };
  }

  async listUpcomingBills(userId: string, days: number = 30): Promise<IBill[]> {
    return await this.billRepository.findUpcoming(userId, days);
  }

  async markBillPaid(billId: string, paymentId: string, userId: string): Promise<IBill> {
    const bill = await this.billRepository.findById(billId);
    if (!bill) {
      throw new AppError(404, 'BILL_NOT_FOUND', 'Bill not found');
    }
    if (bill.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update bill belonging to another user');
    }

    const updated = await this.billRepository.update(billId, {
      status: 'PAID',
      autopayMandateId: paymentId,
    });

    if (!updated) {
      throw new AppError(500, 'UPDATE_FAILED', 'Failed to update bill');
    }

    return updated;
  }

  async importBills(userId: string, source?: 'GMAIL' | 'SMS'): Promise<{ imported: number; failed: number }> {
    // TODO: Implement Gmail/SMS import logic
    // This would call the Gmail service or SMS parser
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

  async getRecurringSuggestions(userId: string): Promise<IBill[]> {
    return await this.billRepository.findRecurringPatterns(userId);
  }
}

