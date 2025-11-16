"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransactionRepository = void 0;
const database_1 = require("../../../config/database");
const asset_transaction_entity_1 = require("../../../models/postgres/investments/asset-transaction.entity");
class AssetTransactionRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(asset_transaction_entity_1.AssetTransaction);
        }
        return this.repository;
    }
    async create(transactionData) {
        const repo = this.getRepository();
        const transaction = repo.create(transactionData);
        return await repo.save(transaction);
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id }, relations: ['asset'] });
    }
    async findByAssetId(assetId) {
        return await this.getRepository().find({
            where: { assetId },
            order: { transactionDate: 'DESC' },
        });
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const queryBuilder = this.getRepository()
            .createQueryBuilder('transaction')
            .where('transaction.userId = :userId', { userId });
        if (filters.assetId) {
            queryBuilder.andWhere('transaction.assetId = :assetId', { assetId: filters.assetId });
        }
        if (filters.startDate) {
            queryBuilder.andWhere('transaction.transactionDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('transaction.transactionDate <= :endDate', { endDate: filters.endDate });
        }
        if (filters.transactionType) {
            queryBuilder.andWhere('transaction.transactionType = :type', { type: filters.transactionType });
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [transactions, total] = await Promise.all([
            queryBuilder
                .orderBy('transaction.transactionDate', 'DESC')
                .skip(skip)
                .take(pagination.limit)
                .getMany(),
            queryBuilder.getCount(),
        ]);
        return { transactions, total };
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('Transaction not found after update');
        return updated;
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
    async getHoldings(assetId) {
        const transactions = await this.findByAssetId(assetId);
        let totalUnits = 0;
        let totalCost = 0;
        transactions.forEach((tx) => {
            if (tx.transactionType === 'BUY') {
                totalUnits += Number(tx.units);
                totalCost += Number(tx.totalAmount);
            }
            else {
                totalUnits -= Number(tx.units);
                totalCost -= Number(tx.totalAmount);
            }
        });
        const averageCost = totalUnits > 0 ? totalCost / totalUnits : 0;
        return { totalUnits, averageCost };
    }
}
exports.AssetTransactionRepository = AssetTransactionRepository;
//# sourceMappingURL=asset-transaction.repository.js.map