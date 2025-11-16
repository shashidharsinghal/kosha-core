"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentController = void 0;
const investment_service_1 = require("../../services/investments/investment.service");
class InvestmentController {
    constructor() {
        this.investmentService = new investment_service_1.InvestmentService();
    }
    async addAsset(req, res) {
        const userId = req.userId;
        const assetData = req.body;
        try {
            const asset = await this.investmentService.addAsset(userId, assetData);
            res.status(201).json({ data: asset });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updateAsset(req, res) {
        const userId = req.userId;
        const { assetId } = req.params;
        const updates = req.body;
        try {
            const asset = await this.investmentService.updateAsset(assetId, userId, updates);
            res.status(200).json({ data: asset });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async addTransaction(req, res) {
        const userId = req.userId;
        const transactionData = req.body;
        try {
            const transaction = await this.investmentService.addTransaction(userId, transactionData);
            res.status(201).json({ data: transaction });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updateTransaction(req, res) {
        const userId = req.userId;
        const { transactionId } = req.params;
        const updates = req.body;
        try {
            const transaction = await this.investmentService.updateTransaction(transactionId, userId, updates);
            res.status(200).json({ data: transaction });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async deleteTransaction(req, res) {
        const userId = req.userId;
        const { transactionId } = req.params;
        try {
            const result = await this.investmentService.deleteTransaction(transactionId, userId);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listInvestments(req, res) {
        const userId = req.userId;
        const { type, page = '1', limit = '20' } = req.query;
        try {
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
            };
            const result = await this.investmentService.listInvestments(userId, type, pagination);
            res.status(200).json({
                data: result.investments,
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
    async fetchLivePrice(req, res) {
        const { assetId } = req.params;
        const { symbol } = req.query;
        try {
            const result = await this.investmentService.fetchLivePrice(assetId, symbol);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getPortfolioSummary(req, res) {
        const userId = req.userId;
        try {
            const summary = await this.investmentService.getPortfolioSummary(userId);
            res.status(200).json({ data: summary });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getPriceHistory(req, res) {
        const { assetId } = req.params;
        const { symbol, startDate, endDate } = req.query;
        try {
            const history = await this.investmentService.getPriceHistory(assetId, symbol, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.status(200).json({ data: history });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getTransactionHistory(req, res) {
        const userId = req.userId;
        const { assetId, startDate, endDate, transactionType, page = '1', limit = '20' } = req.query;
        try {
            const filters = {};
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            if (transactionType)
                filters.transactionType = transactionType;
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
            };
            const result = await this.investmentService.getTransactionHistory(userId, assetId, filters, pagination);
            res.status(200).json({
                data: result.transactions,
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
}
exports.InvestmentController = InvestmentController;
//# sourceMappingURL=investment.controller.js.map