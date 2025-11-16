"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandateRepository = void 0;
const database_1 = require("../../../config/database");
const mandate_entity_1 = require("../../../models/postgres/payments/mandate.entity");
class MandateRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(mandate_entity_1.Mandate);
        }
        return this.repository;
    }
    async create(mandateData) {
        const repo = this.getRepository();
        const mandate = repo.create(mandateData);
        return await repo.save(mandate);
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id } });
    }
    async findByUserId(userId, status) {
        const query = { userId };
        if (status)
            query.status = status;
        return await this.getRepository().find({ where: query });
    }
    async findActiveMandates() {
        return await this.getRepository().find({
            where: { status: 'ACTIVE' },
            order: { nextDueDate: 'ASC' },
        });
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('Mandate not found after update');
        return updated;
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
}
exports.MandateRepository = MandateRepository;
//# sourceMappingURL=mandate.repository.js.map