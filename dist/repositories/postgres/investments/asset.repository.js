"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetRepository = void 0;
const database_1 = require("../../../config/database");
const asset_entity_1 = require("../../../models/postgres/investments/asset.entity");
class AssetRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(asset_entity_1.Asset);
        }
        return this.repository;
    }
    async create(assetData) {
        const repo = this.getRepository();
        const asset = repo.create(assetData);
        return await repo.save(asset);
    }
    async findById(id) {
        return await this.getRepository().findOne({ where: { id } });
    }
    async findByUserId(userId, type) {
        const query = { userId };
        if (type)
            query.type = type;
        return await this.getRepository().find({ where: query });
    }
    async update(id, updates) {
        await this.getRepository().update(id, updates);
        const updated = await this.findById(id);
        if (!updated)
            throw new Error('Asset not found after update');
        return updated;
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
}
exports.AssetRepository = AssetRepository;
//# sourceMappingURL=asset.repository.js.map