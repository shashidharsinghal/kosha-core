"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeController = void 0;
const income_service_1 = require("../../services/income/income.service");
class IncomeController {
    constructor() {
        this.incomeService = new income_service_1.IncomeService();
    }
    async addIncome(req, res) {
        const userId = req.userId;
        const incomeData = req.body;
        try {
            const income = await this.incomeService.addIncome(userId, incomeData);
            res.status(201).json({ data: income });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updateIncome(req, res) {
        const userId = req.userId;
        const { incomeId } = req.params;
        const updates = req.body;
        try {
            const income = await this.incomeService.updateIncome(incomeId, userId, updates);
            res.status(200).json({ data: income });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listIncomes(req, res) {
        const userId = req.userId;
        const { startDate, endDate, category, page = '1', limit = '20', sort, } = req.query;
        try {
            const filters = {};
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            if (category)
                filters.category = category;
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort,
            };
            const result = await this.incomeService.listIncomes(userId, filters, pagination);
            res.status(200).json({
                data: result.incomes,
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
    async deleteIncome(req, res) {
        const userId = req.userId;
        const { incomeId } = req.params;
        try {
            const result = await this.incomeService.deleteIncome(incomeId, userId);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async importIncomes(req, res) {
        const userId = req.userId;
        try {
            const result = await this.incomeService.importIncomes(userId);
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
            const summary = await this.incomeService.getSummary(userId, filters.startDate, filters.endDate);
            res.status(200).json({ data: summary });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.IncomeController = IncomeController;
//# sourceMappingURL=income.controller.js.map