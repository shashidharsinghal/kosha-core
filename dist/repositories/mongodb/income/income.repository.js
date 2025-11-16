"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRepository = void 0;
const income_schema_1 = require("../../../models/mongodb/income/income.schema");
class IncomeRepository {
    async create(incomeData) {
        const income = new income_schema_1.Income(incomeData);
        return await income.save();
    }
    async findById(id) {
        return await income_schema_1.Income.findById(id);
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const query = { userId };
        if (filters.startDate || filters.endDate) {
            query.receivedAt = {};
            if (filters.startDate)
                query.receivedAt.$gte = filters.startDate;
            if (filters.endDate)
                query.receivedAt.$lte = filters.endDate;
        }
        if (filters.category)
            query.category = filters.category;
        const sortOptions = {};
        if (pagination.sort) {
            const direction = pagination.sort.startsWith('-') ? -1 : 1;
            const field = pagination.sort.replace(/^-/, '');
            sortOptions[field] = direction;
        }
        else {
            sortOptions.receivedAt = -1;
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [incomes, total] = await Promise.all([
            income_schema_1.Income.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
            income_schema_1.Income.countDocuments(query),
        ]);
        return { incomes, total };
    }
    async getSummary(userId, startDate, endDate) {
        const query = { userId };
        if (startDate || endDate) {
            query.receivedAt = {};
            if (startDate)
                query.receivedAt.$gte = startDate;
            if (endDate)
                query.receivedAt.$lte = endDate;
        }
        const incomes = await income_schema_1.Income.find(query);
        const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const byCategory = {};
        const byMonth = {};
        incomes.forEach((inc) => {
            const category = inc.category || 'Uncategorized';
            byCategory[category] = (byCategory[category] || 0) + inc.amount;
            const monthKey = inc.receivedAt.toISOString().substring(0, 7);
            byMonth[monthKey] = (byMonth[monthKey] || 0) + inc.amount;
        });
        return { total, byCategory, byMonth };
    }
    async update(id, updates) {
        return await income_schema_1.Income.findByIdAndUpdate(id, updates, { new: true });
    }
    async delete(id) {
        await income_schema_1.Income.findByIdAndDelete(id);
    }
}
exports.IncomeRepository = IncomeRepository;
//# sourceMappingURL=income.repository.js.map