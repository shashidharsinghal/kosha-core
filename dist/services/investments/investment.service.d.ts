import { Asset } from '../../models/postgres/investments/asset.entity';
import { AssetTransaction } from '../../models/postgres/investments/asset-transaction.entity';
export declare class InvestmentService {
    private assetRepository;
    private transactionRepository;
    private priceRepository;
    constructor();
    addAsset(userId: string, assetData: Partial<Asset>): Promise<Asset>;
    updateAsset(assetId: string, userId: string, updates: Partial<Asset>): Promise<Asset>;
    addTransaction(userId: string, transactionData: Partial<AssetTransaction>): Promise<AssetTransaction>;
    updateTransaction(transactionId: string, userId: string, updates: Partial<AssetTransaction>): Promise<AssetTransaction>;
    deleteTransaction(transactionId: string, userId: string): Promise<{
        success: boolean;
    }>;
    listInvestments(userId: string, type?: string, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        investments: Array<{
            asset: Asset;
            currentUnits: number;
            averageCost: number;
            currentValue: number;
            roi: number;
        }>;
        total: number;
        page: number;
        limit: number;
    }>;
    fetchLivePrice(assetId: string, symbol?: string): Promise<{
        currentValue: number;
        price: number;
    }>;
    getPortfolioSummary(userId: string): Promise<{
        totalValue: number;
        totalCost: number;
        roi: number;
        roiPercentage: number;
        byType: Record<string, number>;
        byAsset: Array<{
            symbol: string;
            value: number;
        }>;
    }>;
    getPriceHistory(assetId: string, symbol?: string, startDate?: Date, endDate?: Date): Promise<Array<{
        date: Date;
        price: number;
    }>>;
    getTransactionHistory(userId: string, assetId?: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        transactionType?: 'BUY' | 'SELL';
    }, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        transactions: AssetTransaction[];
        total: number;
        page: number;
        limit: number;
    }>;
}
//# sourceMappingURL=investment.service.d.ts.map