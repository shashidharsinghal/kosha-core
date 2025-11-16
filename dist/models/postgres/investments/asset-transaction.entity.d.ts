import { Asset } from './asset.entity';
export declare class AssetTransaction {
    id: string;
    assetId: string;
    asset: Asset;
    userId: string;
    transactionDate: Date;
    transactionType: 'BUY' | 'SELL';
    units: number;
    pricePerUnit: number;
    fees: number;
    totalAmount: number;
    notes?: string;
    createdAt: Date;
}
//# sourceMappingURL=asset-transaction.entity.d.ts.map