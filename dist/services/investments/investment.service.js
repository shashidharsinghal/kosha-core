"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
const asset_repository_1 = require("../../repositories/postgres/investments/asset.repository");
const asset_transaction_repository_1 = require("../../repositories/postgres/investments/asset-transaction.repository");
const asset_price_repository_1 = require("../../repositories/postgres/investments/asset-price.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class InvestmentService {
    constructor() {
        this.assetRepository = new asset_repository_1.AssetRepository();
        this.transactionRepository = new asset_transaction_repository_1.AssetTransactionRepository();
        this.priceRepository = new asset_price_repository_1.AssetPriceRepository();
    }
    async addAsset(userId, assetData) {
        return await this.assetRepository.create({ ...assetData, userId });
    }
    async updateAsset(assetId, userId, updates) {
        const asset = await this.assetRepository.findById(assetId);
        if (!asset) {
            throw new errorHandler_1.AppError(404, 'ASSET_NOT_FOUND', 'Asset not found');
        }
        if (asset.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update asset belonging to another user');
        }
        return await this.assetRepository.update(assetId, updates);
    }
    async addTransaction(userId, transactionData) {
        const asset = await this.assetRepository.findById(transactionData.assetId);
        if (!asset) {
            throw new errorHandler_1.AppError(404, 'ASSET_NOT_FOUND', 'Asset not found');
        }
        if (asset.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot add transaction for another user\'s asset');
        }
        // Calculate total amount
        const totalAmount = Number(transactionData.units) * Number(transactionData.pricePerUnit) + Number(transactionData.fees || 0);
        return await this.transactionRepository.create({
            ...transactionData,
            userId,
            totalAmount,
        });
    }
    async updateTransaction(transactionId, userId, updates) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new errorHandler_1.AppError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
        }
        if (transaction.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update transaction belonging to another user');
        }
        if (updates.units || updates.pricePerUnit || updates.fees) {
            const units = Number(updates.units || transaction.units);
            const pricePerUnit = Number(updates.pricePerUnit || transaction.pricePerUnit);
            const fees = Number(updates.fees || transaction.fees || 0);
            updates.totalAmount = units * pricePerUnit + fees;
        }
        return await this.transactionRepository.update(transactionId, updates);
    }
    async deleteTransaction(transactionId, userId) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new errorHandler_1.AppError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
        }
        if (transaction.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot delete transaction belonging to another user');
        }
        await this.transactionRepository.delete(transactionId);
        return { success: true };
    }
    async listInvestments(userId, type, pagination = { page: 1, limit: 20 }) {
        const assets = await this.assetRepository.findByUserId(userId, type);
        const investments = await Promise.all(assets.map(async (asset) => {
            const holdings = await this.transactionRepository.getHoldings(asset.id);
            const latestPrice = await this.priceRepository.findLatest(asset.symbol);
            const currentPrice = latestPrice ? Number(latestPrice.price) : 0;
            const currentValue = holdings.totalUnits * currentPrice;
            const totalCost = holdings.averageCost * holdings.totalUnits;
            const roi = totalCost > 0 ? ((currentValue - totalCost) / totalCost) * 100 : 0;
            return {
                asset,
                currentUnits: holdings.totalUnits,
                averageCost: holdings.averageCost,
                currentValue,
                roi,
            };
        }));
        return {
            investments,
            total: investments.length,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async fetchLivePrice(assetId, symbol) {
        const asset = assetId ? await this.assetRepository.findById(assetId) : null;
        const assetSymbol = symbol || asset?.symbol;
        if (!assetSymbol) {
            throw new errorHandler_1.AppError(400, 'SYMBOL_REQUIRED', 'Asset symbol is required');
        }
        // TODO: Fetch from external market data API
        const latestPrice = await this.priceRepository.findLatest(assetSymbol);
        if (!latestPrice) {
            throw new errorHandler_1.AppError(404, 'PRICE_NOT_FOUND', 'Price data not available');
        }
        return {
            currentValue: Number(latestPrice.price),
            price: Number(latestPrice.price),
        };
    }
    async getPortfolioSummary(userId) {
        const assets = await this.assetRepository.findByUserId(userId);
        let totalValue = 0;
        let totalCost = 0;
        const byType = {};
        const byAsset = [];
        for (const asset of assets) {
            const holdings = await this.transactionRepository.getHoldings(asset.id);
            const latestPrice = await this.priceRepository.findLatest(asset.symbol);
            const currentPrice = latestPrice ? Number(latestPrice.price) : 0;
            const assetValue = holdings.totalUnits * currentPrice;
            const assetCost = holdings.averageCost * holdings.totalUnits;
            totalValue += assetValue;
            totalCost += assetCost;
            byType[asset.type] = (byType[asset.type] || 0) + assetValue;
            byAsset.push({ symbol: asset.symbol, value: assetValue });
        }
        const roi = totalValue - totalCost;
        const roiPercentage = totalCost > 0 ? (roi / totalCost) * 100 : 0;
        return {
            totalValue,
            totalCost,
            roi,
            roiPercentage,
            byType,
            byAsset: byAsset.sort((a, b) => b.value - a.value),
        };
    }
    async getPriceHistory(assetId, symbol, startDate, endDate) {
        const asset = assetId ? await this.assetRepository.findById(assetId) : null;
        const assetSymbol = symbol || asset?.symbol;
        if (!assetSymbol) {
            throw new errorHandler_1.AppError(400, 'SYMBOL_REQUIRED', 'Asset symbol is required');
        }
        return await this.priceRepository.findHistory(assetSymbol, startDate, endDate);
    }
    async getTransactionHistory(userId, assetId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { transactions, total } = await this.transactionRepository.findByUserId(userId, { ...filters, assetId }, pagination);
        return { transactions, total, page: pagination.page, limit: pagination.limit };
    }
}
exports.InvestmentService = InvestmentService;
//# sourceMappingURL=investment.service.js.map