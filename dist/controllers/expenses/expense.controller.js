"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("../../services/expenses/expense.service");
class ExpenseController {
    constructor() {
        this.expenseService = new expense_service_1.ExpenseService();
    }
    async addExpense(req, res) {
        const userId = req.userId;
        const expenseData = req.body;
        try {
            const expense = await this.expenseService.addExpense(userId, expenseData);
            res.status(201).json({ data: expense });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updateExpense(req, res) {
        const userId = req.userId;
        const { expenseId } = req.params;
        const updates = req.body;
        try {
            const expense = await this.expenseService.updateExpense(expenseId, userId, updates);
            res.status(200).json({ data: expense });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listExpenses(req, res) {
        const userId = req.userId;
        const { startDate, endDate, category, paymentMethod, page = '1', limit = '20', sort, } = req.query;
        try {
            const filters = {};
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            if (category)
                filters.category = category;
            if (paymentMethod)
                filters.paymentMethod = paymentMethod;
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort,
            };
            const result = await this.expenseService.listExpenses(userId, filters, pagination);
            res.status(200).json({
                data: result.expenses,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async deleteExpense(req, res) {
        const userId = req.userId;
        const { expenseId } = req.params;
        try {
            const result = await this.expenseService.deleteExpense(expenseId, userId);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async importExpenses(req, res) {
        const userId = req.userId;
        const { source } = req.body;
        if (!source) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Source is required' },
            });
            return;
        }
        try {
            const result = await this.expenseService.importExpenses(userId, source);
            res.status(202).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getSummary(req, res) {
        const userId = req.userId;
        const { startDate, endDate } = req.query;
        try {
            const filters = {};
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            const summary = await this.expenseService.getSummary(userId, filters.startDate, filters.endDate);
            res.status(200).json({ data: summary });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=expense.controller.js.map