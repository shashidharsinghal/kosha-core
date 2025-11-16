import { AssetRepository } from '../../repositories/postgres/investments/asset.repository';
import { AssetTransactionRepository } from '../../repositories/postgres/investments/asset-transaction.repository';
import { AssetPriceRepository } from '../../repositories/postgres/investments/asset-price.repository';
import { AppError } from '../../middleware/errorHandler';
import { Asset } from '../../models/postgres/investments/asset.entity';
import { AssetTransaction } from '../../models/postgres/investments/asset-transaction.entity';

export class InvestmentService {
  private assetRepository: AssetRepository;
  private transactionRepository: AssetTransactionRepository;
  private priceRepository: AssetPriceRepository;

  constructor() {
    this.assetRepository = new AssetRepository();
    this.transactionRepository = new AssetTransactionRepository();
    this.priceRepository = new AssetPriceRepository();
  }

  async addAsset(userId: string, assetData: Partial<Asset>): Promise<Asset> {
    return await this.assetRepository.create({ ...assetData, userId });
  }

  async updateAsset(assetId: string, userId: string, updates: Partial<Asset>): Promise<Asset> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new AppError(404, 'ASSET_NOT_FOUND', 'Asset not found');
    }
    if (asset.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update asset belonging to another user');
    }

    return await this.assetRepository.update(assetId, updates);
  }

  async addTransaction(userId: string, transactionData: Partial<AssetTransaction>): Promise<AssetTransaction> {
    const asset = await this.assetRepository.findById(transactionData.assetId!);
    if (!asset) {
      throw new AppError(404, 'ASSET_NOT_FOUND', 'Asset not found');
    }
    if (asset.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot add transaction for another user\'s asset');
    }

    // Calculate total amount
    const totalAmount = Number(transactionData.units) * Number(transactionData.pricePerUnit) + Number(transactionData.fees || 0);
    
    return await this.transactionRepository.create({
      ...transactionData,
      userId,
      totalAmount,
    });
  }

  async updateTransaction(
    transactionId: string,
    userId: string,
    updates: Partial<AssetTransaction>
  ): Promise<AssetTransaction> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new AppError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update transaction belonging to another user');
    }

    if (updates.units || updates.pricePerUnit || updates.fees) {
      const units = Number(updates.units || transaction.units);
      const pricePerUnit = Number(updates.pricePerUnit || transaction.pricePerUnit);
      const fees = Number(updates.fees || transaction.fees || 0);
      updates.totalAmount = units * pricePerUnit + fees;
    }

    return await this.transactionRepository.update(transactionId, updates);
  }

  async deleteTransaction(transactionId: string, userId: string): Promise<{ success: boolean }> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new AppError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete transaction belonging to another user');
    }

    await this.transactionRepository.delete(transactionId);
    return { success: true };
  }

  async listInvestments(
    userId: string,
    type?: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{
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
  }> {
    const assets = await this.assetRepository.findByUserId(userId, type);
    const investments = await Promise.all(
      assets.map(async (asset) => {
        const holdings = await this.transactionRepository.getHoldings(asset.id);
        const latestPrice = await this.priceRepository.findLatest(asset.symbol);
        const currentPrice = latestPrice ? Number(latestPrice.price) : 0;
        const currentValue = holdings.totalUnits * currentPrice;
        const totalCost = holdings.averageCost * holdings.totalUnits;
        const roi = totalCost > 0 ? ((currentValue - totalCost) / totalCost) * 100 : 0;

        return {
          asset,
          currentUnits: holdings.totalUnits,
          averageCost: holdings.averageCost,
          currentValue,
          roi,
        };
      })
    );

    return {
      investments,
      total: investments.length,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async fetchLivePrice(assetId: string, symbol?: string): Promise<{ currentValue: number; price: number }> {
    const asset = assetId ? await this.assetRepository.findById(assetId) : null;
    const assetSymbol = symbol || asset?.symbol;
    
    if (!assetSymbol) {
      throw new AppError(400, 'SYMBOL_REQUIRED', 'Asset symbol is required');
    }

    // TODO: Fetch from external market data API
    const latestPrice = await this.priceRepository.findLatest(assetSymbol);
    if (!latestPrice) {
      throw new AppError(404, 'PRICE_NOT_FOUND', 'Price data not available');
    }

    return {
      currentValue: Number(latestPrice.price),
      price: Number(latestPrice.price),
    };
  }

  async getPortfolioSummary(userId: string): Promise<{
    totalValue: number;
    totalCost: number;
    roi: number;
    roiPercentage: number;
    byType: Record<string, number>;
    byAsset: Array<{ symbol: string; value: number }>;
  }> {
    const assets = await this.assetRepository.findByUserId(userId);
    let totalValue = 0;
    let totalCost = 0;
    const byType: Record<string, number> = {};
    const byAsset: Array<{ symbol: string; value: number }> = [];

    for (const asset of assets) {
      const holdings = await this.transactionRepository.getHoldings(asset.id);
      const latestPrice = await this.priceRepository.findLatest(asset.symbol);
      const currentPrice = latestPrice ? Number(latestPrice.price) : 0;
      const assetValue = holdings.totalUnits * currentPrice;
      const assetCost = holdings.averageCost * holdings.totalUnits;

      totalValue += assetValue;
      totalCost += assetCost;
      byType[asset.type] = (byType[asset.type] || 0) + assetValue;
      byAsset.push({ symbol: asset.symbol, value: assetValue });
    }

    const roi = totalValue - totalCost;
    const roiPercentage = totalCost > 0 ? (roi / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      roi,
      roiPercentage,
      byType,
      byAsset: byAsset.sort((a, b) => b.value - a.value),
    };
  }

  async getPriceHistory(
    assetId: string,
    symbol?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ date: Date; price: number }>> {
    const asset = assetId ? await this.assetRepository.findById(assetId) : null;
    const assetSymbol = symbol || asset?.symbol;

    if (!assetSymbol) {
      throw new AppError(400, 'SYMBOL_REQUIRED', 'Asset symbol is required');
    }

    return await this.priceRepository.findHistory(assetSymbol, startDate, endDate);
  }

  async getTransactionHistory(
    userId: string,
    assetId?: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      transactionType?: 'BUY' | 'SELL';
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{
    transactions: AssetTransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { transactions, total } = await this.transactionRepository.findByUserId(
      userId,
      { ...filters, assetId },
      pagination
    );

    return { transactions, total, page: pagination.page, limit: pagination.limit };
  }
}

