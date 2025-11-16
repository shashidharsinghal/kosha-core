"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionRepository = void 0;
const database_1 = require("../../../config/database");
const user_session_entity_1 = require("../../../models/postgres/authentication/user-session.entity");
class UserSessionRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(user_session_entity_1.UserSession);
        }
        return this.repository;
    }
    async create(sessionData) {
        const repo = this.getRepository();
        const session = repo.create(sessionData);
        return await repo.save(session);
    }
    async findByRefreshToken(refreshToken) {
        return await this.getRepository().findOne({ where: { refreshToken } });
    }
    async findByUserId(userId) {
        return await this.getRepository().find({ where: { userId } });
    }
    async delete(refreshToken) {
        await this.getRepository().delete({ refreshToken });
    }
    async deleteExpired() {
        await this.getRepository()
            .createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .execute();
    }
}
exports.UserSessionRepository = UserSessionRepository;
//# sourceMappingURL=user-session.repository.js.map