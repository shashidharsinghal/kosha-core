import { Response } from 'express';
import { IncomeService } from '../../services/income/income.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class IncomeController {
  private incomeService: IncomeService;

  constructor() {
    this.incomeService = new IncomeService();
  }

  async addIncome(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const incomeData = req.body;

    try {
      const income = await this.incomeService.addIncome(userId, incomeData);
      res.status(201).json({ data: income } as ApiResponse<typeof income>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updateIncome(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { incomeId } = req.params;
    const updates = req.body;

    try {
      const income = await this.incomeService.updateIncome(incomeId, userId, updates);
      res.status(200).json({ data: income } as ApiResponse<typeof income>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listIncomes(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const {
      startDate,
      endDate,
      category,
      page = '1',
      limit = '20',
      sort,
    } = req.query;

    try {
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (category) filters.category = category;

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string | undefined,
      };

      const result = await this.incomeService.listIncomes(userId, filters, pagination);
      res.status(200).json({
        data: result.incomes,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.incomes[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async deleteIncome(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { incomeId } = req.params;

    try {
      const result = await this.incomeService.deleteIncome(incomeId, userId);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async importIncomes(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;

    try {
      const result = await this.incomeService.importIncomes(userId);
      res.status(202).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    try {
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const summary = await this.incomeService.getSummary(
        userId,
        filters.startDate,
        filters.endDate
      );
      res.status(200).json({ data: summary } as ApiResponse<typeof summary>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

