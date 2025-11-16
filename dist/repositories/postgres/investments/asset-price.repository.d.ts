import { AssetPrice } from '../../../models/postgres/investments/asset-price.entity';
export declare class AssetPriceRepository {
    private repository;
    private getRepository;
    create(priceData: Partial<AssetPrice>): Promise<AssetPrice>;
    findLatest(symbol: string): Promise<AssetPrice | null>;
    findHistory(symbol: string, startDate?: Date, endDate?: Date): Promise<{
        date: Date;
        price: number;
    }[]>;
    upsertPrice(symbol: string, price: number, date: Date, source?: string): Promise<AssetPrice>;
}
//# sourceMappingURL=asset-price.repository.d.ts.map