"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const expense_schema_1 = require("../../../models/mongodb/expenses/expense.schema");
class ExpenseRepository {
    async create(expenseData) {
        const expense = new expense_schema_1.Expense(expenseData);
        return await expense.save();
    }
    async findById(id) {
        return await expense_schema_1.Expense.findById(id);
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const query = { userId };
        if (filters.startDate || filters.endDate) {
            query.spentAt = {};
            if (filters.startDate)
                query.spentAt.$gte = filters.startDate;
            if (filters.endDate)
                query.spentAt.$lte = filters.endDate;
        }
        if (filters.category)
            query.category = filters.category;
        if (filters.paymentMethod)
            query.paymentMethod = filters.paymentMethod;
        const sortOptions = {};
        if (pagination.sort) {
            const direction = pagination.sort.startsWith('-') ? -1 : 1;
            const field = pagination.sort.replace(/^-/, '');
            sortOptions[field] = direction;
        }
        else {
            sortOptions.spentAt = -1;
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [expenses, total] = await Promise.all([
            expense_schema_1.Expense.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
            expense_schema_1.Expense.countDocuments(query),
        ]);
        return { expenses, total };
    }
    async getSummary(userId, startDate, endDate) {
        const query = { userId };
        if (startDate || endDate) {
            query.spentAt = {};
            if (startDate)
                query.spentAt.$gte = startDate;
            if (endDate)
                query.spentAt.$lte = endDate;
        }
        const expenses = await expense_schema_1.Expense.find(query);
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const byCategory = {};
        const byMonth = {};
        expenses.forEach((exp) => {
            byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
            const monthKey = exp.spentAt.toISOString().substring(0, 7); // YYYY-MM
            byMonth[monthKey] = (byMonth[monthKey] || 0) + exp.amount;
        });
        return { total, byCategory, byMonth };
    }
    async update(id, updates) {
        return await expense_schema_1.Expense.findByIdAndUpdate(id, updates, { new: true });
    }
    async delete(id) {
        await expense_schema_1.Expense.findByIdAndDelete(id);
    }
}
exports.ExpenseRepository = ExpenseRepository;
//# sourceMappingURL=expense.repository.js.map