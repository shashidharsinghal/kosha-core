"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const database_1 = require("../../../config/database");
const payment_entity_1 = require("../../../models/postgres/payments/payment.entity");
class PaymentRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(payment_entity_1.Payment);
        }
        return this.repository;
    }
    async create(paymentData) {
        const repo = this.getRepository();
        const payment = repo.create(paymentData);
        return await repo.save(payment);
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id } });
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const queryBuilder = this.getRepository()
            .createQueryBuilder('payment')
            .where('payment.userId = :userId', { userId });
        if (filters.billId) {
            queryBuilder.andWhere('payment.billId = :billId', { billId: filters.billId });
        }
        if (filters.status) {
            queryBuilder.andWhere('payment.status = :status', { status: filters.status });
        }
        if (filters.startDate) {
            queryBuilder.andWhere('payment.initiatedAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('payment.initiatedAt <= :endDate', { endDate: filters.endDate });
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [payments, total] = await Promise.all([
            queryBuilder
                .orderBy('payment.initiatedAt', 'DESC')
                .skip(skip)
                .take(pagination.limit)
                .getMany(),
            queryBuilder.getCount(),
        ]);
        return { payments, total };
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('Payment not found after update');
        return updated;
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=payment.repository.js.map