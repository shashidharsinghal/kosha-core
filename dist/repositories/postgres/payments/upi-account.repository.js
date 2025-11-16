"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPIAccountRepository = void 0;
const database_1 = require("../../../config/database");
const upi_account_entity_1 = require("../../../models/postgres/payments/upi-account.entity");
class UPIAccountRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(upi_account_entity_1.UPIAccount);
        }
        return this.repository;
    }
    async create(accountData) {
        const repo = this.getRepository();
        const account = repo.create(accountData);
        return await repo.save(account);
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id } });
    }
    async findByUserId(userId) {
        return await this.getRepository().find({ where: { userId } });
    }
    async findActiveByUserId(userId) {
        return await this.getRepository().find({ where: { userId, status: 'ACTIVE' } });
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('UPI Account not found after update');
        return updated;
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
}
exports.UPIAccountRepository = UPIAccountRepository;
//# sourceMappingURL=upi-account.repository.js.map