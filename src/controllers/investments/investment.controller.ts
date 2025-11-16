import { Response } from 'express';
import { InvestmentService } from '../../services/investments/investment.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class InvestmentController {
  private investmentService: InvestmentService;

  constructor() {
    this.investmentService = new InvestmentService();
  }

  async addAsset(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const assetData = req.body;

    try {
      const asset = await this.investmentService.addAsset(userId, assetData);
      res.status(201).json({ data: asset } as ApiResponse<typeof asset>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updateAsset(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { assetId } = req.params;
    const updates = req.body;

    try {
      const asset = await this.investmentService.updateAsset(assetId, userId, updates);
      res.status(200).json({ data: asset } as ApiResponse<typeof asset>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async addTransaction(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const transactionData = req.body;

    try {
      const transaction = await this.investmentService.addTransaction(userId, transactionData);
      res.status(201).json({ data: transaction } as ApiResponse<typeof transaction>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updateTransaction(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { transactionId } = req.params;
    const updates = req.body;

    try {
      const transaction = await this.investmentService.updateTransaction(transactionId, userId, updates);
      res.status(200).json({ data: transaction } as ApiResponse<typeof transaction>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async deleteTransaction(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { transactionId } = req.params;

    try {
      const result = await this.investmentService.deleteTransaction(transactionId, userId);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listInvestments(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { type, page = '1', limit = '20' } = req.query;

    try {
      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await this.investmentService.listInvestments(
        userId,
        type as string | undefined,
        pagination
      );
      res.status(200).json({
        data: result.investments,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.investments[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async fetchLivePrice(req: AuthRequest, res: Response): Promise<void> {
    const { assetId } = req.params;
    const { symbol } = req.query;

    try {
      const result = await this.investmentService.fetchLivePrice(assetId, symbol as string | undefined);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getPortfolioSummary(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;

    try {
      const summary = await this.investmentService.getPortfolioSummary(userId);
      res.status(200).json({ data: summary } as ApiResponse<typeof summary>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getPriceHistory(req: AuthRequest, res: Response): Promise<void> {
    const { assetId } = req.params;
    const { symbol, startDate, endDate } = req.query;

    try {
      const history = await this.investmentService.getPriceHistory(
        assetId,
        symbol as string | undefined,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.status(200).json({ data: history } as ApiResponse<typeof history>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getTransactionHistory(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { assetId, startDate, endDate, transactionType, page = '1', limit = '20' } = req.query;

    try {
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (transactionType) filters.transactionType = transactionType;

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await this.investmentService.getTransactionHistory(
        userId,
        assetId as string | undefined,
        filters,
        pagination
      );
      res.status(200).json({
        data: result.transactions,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.transactions[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

