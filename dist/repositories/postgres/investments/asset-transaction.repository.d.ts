import { AssetTransaction } from '../../../models/postgres/investments/asset-transaction.entity';
export declare class AssetTransactionRepository {
    private repository;
    private getRepository;
    create(transactionData: Partial<AssetTransaction>): Promise<AssetTransaction>;
    findById(id: string): Promise<AssetTransaction | null>;
    findByAssetId(assetId: string): Promise<AssetTransaction[]>;
    findByUserId(userId: string, filters?: {
        assetId?: string;
        startDate?: Date;
        endDate?: Date;
        transactionType?: 'BUY' | 'SELL';
    }, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        transactions: AssetTransaction[];
        total: number;
    }>;
    update(id: string, updates: Partial<AssetTransaction>): Promise<AssetTransaction>;
    delete(id: string): Promise<void>;
    getHoldings(assetId: string): Promise<{
        totalUnits: number;
        averageCost: number;
    }>;
}
//# sourceMappingURL=asset-transaction.repository.d.ts.map