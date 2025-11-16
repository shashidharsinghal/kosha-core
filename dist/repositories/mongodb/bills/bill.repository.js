"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillRepository = void 0;
const bill_schema_1 = require("../../../models/mongodb/bills/bill.schema");
class BillRepository {
    async create(billData) {
        const bill = new bill_schema_1.Bill(billData);
        return await bill.save();
    }
    async findById(id) {
        return await bill_schema_1.Bill.findById(id);
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const query = { userId };
        if (filters.status)
            query.status = filters.status;
        if (filters.type)
            query.type = filters.type;
        if (filters.startDate || filters.endDate) {
            query.dueDate = {};
            if (filters.startDate)
                query.dueDate.$gte = filters.startDate;
            if (filters.endDate)
                query.dueDate.$lte = filters.endDate;
        }
        const sortOptions = {};
        if (pagination.sort) {
            const direction = pagination.sort.startsWith('-') ? -1 : 1;
            const field = pagination.sort.replace(/^-/, '');
            sortOptions[field] = direction;
        }
        else {
            sortOptions.dueDate = 1;
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [bills, total] = await Promise.all([
            bill_schema_1.Bill.find(query).sort(sortOptions).skip(skip).limit(pagination.limit),
            bill_schema_1.Bill.countDocuments(query),
        ]);
        return { bills, total };
    }
    async findUpcoming(userId, days = 30) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return await bill_schema_1.Bill.find({
            userId,
            dueDate: { $gte: startDate, $lte: endDate },
            status: { $ne: 'PAID' },
        }).sort({ dueDate: 1 });
    }
    async update(id, updates) {
        return await bill_schema_1.Bill.findByIdAndUpdate(id, updates, { new: true });
    }
    async delete(id) {
        await bill_schema_1.Bill.findByIdAndDelete(id);
    }
    async findRecurringPatterns(userId) {
        // Find bills that appear regularly (same provider, similar amount, monthly)
        const bills = await bill_schema_1.Bill.find({ userId, source: { $ne: 'MANUAL' } });
        // TODO: Implement pattern detection logic
        return bills;
    }
}
exports.BillRepository = BillRepository;
//# sourceMappingURL=bill.repository.js.map