"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetPriceRepository = void 0;
const database_1 = require("../../../config/database");
const asset_price_entity_1 = require("../../../models/postgres/investments/asset-price.entity");
class AssetPriceRepository {
    constructor() {
        this.repository = null;
    }
    getRepository() {
        if (!this.repository) {
            this.repository = (0, database_1.getPostgresConnection)().getRepository(asset_price_entity_1.AssetPrice);
        }
        return this.repository;
    }
    async create(priceData) {
        const repo = this.getRepository();
        const price = repo.create(priceData);
        return await repo.save(price);
    }
    async findLatest(symbol) {
        return await this.getRepository().findOne({
            where: { symbol },
            order: { date: 'DESC' },
        });
    }
    async findHistory(symbol, startDate, endDate) {
        const queryBuilder = this.getRepository()
            .createQueryBuilder('price')
            .where('price.symbol = :symbol', { symbol })
            .orderBy('price.date', 'ASC');
        if (startDate) {
            queryBuilder.andWhere('price.date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('price.date <= :endDate', { endDate });
        }
        const prices = await queryBuilder.getMany();
        return prices.map((p) => ({ date: p.date, price: Number(p.price) }));
    }
    async upsertPrice(symbol, price, date, source) {
        const repo = this.getRepository();
        const existing = await repo.findOne({
            where: { symbol, date },
        });
        if (existing) {
            existing.price = price;
            if (source)
                existing.source = source;
            return await repo.save(existing);
        }
        return await this.create({ symbol, price, date, source });
    }
}
exports.AssetPriceRepository = AssetPriceRepository;
//# sourceMappingURL=asset-price.repository.js.map