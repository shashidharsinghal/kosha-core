"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeService = void 0;
const income_repository_1 = require("../../repositories/mongodb/income/income.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class IncomeService {
    constructor() {
        this.incomeRepository = new income_repository_1.IncomeRepository();
    }
    async addIncome(userId, incomeData) {
        return await this.incomeRepository.create({ ...incomeData, userId });
    }
    async updateIncome(incomeId, userId, updates) {
        const income = await this.incomeRepository.findById(incomeId);
        if (!income) {
            throw new errorHandler_1.AppError(404, 'INCOME_NOT_FOUND', 'Income not found');
        }
        if (income.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update income belonging to another user');
        }
        const updated = await this.incomeRepository.update(incomeId, updates);
        if (!updated) {
            throw new errorHandler_1.AppError(500, 'UPDATE_FAILED', 'Failed to update income');
        }
        return updated;
    }
    async listIncomes(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { incomes, total } = await this.incomeRepository.findByUserId(userId, filters, pagination);
        return { incomes, total, page: pagination.page, limit: pagination.limit };
    }
    async deleteIncome(incomeId, userId) {
        const income = await this.incomeRepository.findById(incomeId);
        if (!income) {
            throw new errorHandler_1.AppError(404, 'INCOME_NOT_FOUND', 'Income not found');
        }
        if (income.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot delete income belonging to another user');
        }
        await this.incomeRepository.delete(incomeId);
        return { success: true };
    }
    async importIncomes(userId) {
        // TODO: Implement Gmail import for payroll emails
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
    async getSummary(userId, startDate, endDate) {
        return await this.incomeRepository.getSummary(userId, startDate, endDate);
    }
}
exports.IncomeService = IncomeService;
//# sourceMappingURL=income.service.js.map