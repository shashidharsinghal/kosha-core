"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const expense_repository_1 = require("../../repositories/mongodb/expenses/expense.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class ExpenseService {
    constructor() {
        this.expenseRepository = new expense_repository_1.ExpenseRepository();
    }
    async addExpense(userId, expenseData) {
        return await this.expenseRepository.create({ ...expenseData, userId });
    }
    async updateExpense(expenseId, userId, updates) {
        const expense = await this.expenseRepository.findById(expenseId);
        if (!expense) {
            throw new errorHandler_1.AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found');
        }
        if (expense.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update expense belonging to another user');
        }
        const updated = await this.expenseRepository.update(expenseId, updates);
        if (!updated) {
            throw new errorHandler_1.AppError(500, 'UPDATE_FAILED', 'Failed to update expense');
        }
        return updated;
    }
    async listExpenses(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { expenses, total } = await this.expenseRepository.findByUserId(userId, filters, pagination);
        return { expenses, total, page: pagination.page, limit: pagination.limit };
    }
    async deleteExpense(expenseId, userId) {
        const expense = await this.expenseRepository.findById(expenseId);
        if (!expense) {
            throw new errorHandler_1.AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found');
        }
        if (expense.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot delete expense belonging to another user');
        }
        await this.expenseRepository.delete(expenseId);
        return { success: true };
    }
    async importExpenses(userId, source) {
        // TODO: Implement import logic from external sources
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
        const summary = await this.expenseRepository.getSummary(userId, startDate, endDate);
        // Calculate burn rate (expenses per day)
        const days = startDate && endDate
            ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            : 30;
        const burnRate = summary.total / days;
        return { ...summary, burnRate };
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense.service.js.map