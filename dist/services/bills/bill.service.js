"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const bill_repository_1 = require("../../repositories/mongodb/bills/bill.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class BillService {
    constructor() {
        this.billRepository = new bill_repository_1.BillRepository();
    }
    async upsertBill(userId, billData) {
        if (billData.id) {
            const existing = await this.billRepository.findById(billData.id);
            if (existing && existing.userId !== userId) {
                throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update bill belonging to another user');
            }
            if (existing) {
                return await this.billRepository.update(billData.id, { ...billData, userId }) || existing;
            }
        }
        return await this.billRepository.create({ ...billData, userId });
    }
    async listBills(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { bills, total } = await this.billRepository.findByUserId(userId, filters, pagination);
        return { bills, total, page: pagination.page, limit: pagination.limit };
    }
    async listUpcomingBills(userId, days = 30) {
        return await this.billRepository.findUpcoming(userId, days);
    }
    async markBillPaid(billId, paymentId, userId) {
        const bill = await this.billRepository.findById(billId);
        if (!bill) {
            throw new errorHandler_1.AppError(404, 'BILL_NOT_FOUND', 'Bill not found');
        }
        if (bill.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update bill belonging to another user');
        }
        const updated = await this.billRepository.update(billId, {
            status: 'PAID',
            autopayMandateId: paymentId,
        });
        if (!updated) {
            throw new errorHandler_1.AppError(500, 'UPDATE_FAILED', 'Failed to update bill');
        }
        return updated;
    }
    async importBills(userId, source) {
        // TODO: Implement Gmail/SMS import logic
        // This would call the Gmail service or SMS parser
        let imported = 0;
        let failed = 0;
        // Placeholder implementation
        try {
            // Simulate import process
            imported = 0;
            failed = 0;
        }
        catch (error) {
            failed++;
        }
        return { imported, failed };
    }
    async getRecurringSuggestions(userId) {
        return await this.billRepository.findRecurringPatterns(userId);
    }
}
exports.BillService = BillService;
//# sourceMappingURL=bill.service.js.map