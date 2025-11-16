"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../../../config/database");
const user_entity_1 = require("../../../models/postgres/authentication/user.entity");
class UserRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(user_entity_1.User);
        }
        return this.repository;
    }
    async create(userData) {
        const repo = this.getRepository();
        const user = repo.create(userData);
        return await repo.save(user);
    }
    async findByEmail(email) {
        return await this.getRepository().findOne({ where: { email } });
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id } });
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('User not found after update');
        return updated;
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map