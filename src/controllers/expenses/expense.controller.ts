import { Response } from 'express';
import { ExpenseService } from '../../services/expenses/expense.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  async addExpense(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const expenseData = req.body;

    try {
      const expense = await this.expenseService.addExpense(userId, expenseData);
      res.status(201).json({ data: expense } as ApiResponse<typeof expense>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updateExpense(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { expenseId } = req.params;
    const updates = req.body;

    try {
      const expense = await this.expenseService.updateExpense(expenseId, userId, updates);
      res.status(200).json({ data: expense } as ApiResponse<typeof expense>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listExpenses(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const {
      startDate,
      endDate,
      category,
      paymentMethod,
      page = '1',
      limit = '20',
      sort,
    } = req.query;

    try {
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (category) filters.category = category;
      if (paymentMethod) filters.paymentMethod = paymentMethod;

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string | undefined,
      };

      const result = await this.expenseService.listExpenses(userId, filters, pagination);
      res.status(200).json({
        data: result.expenses,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.expenses[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async deleteExpense(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { expenseId } = req.params;

    try {
      const result = await this.expenseService.deleteExpense(expenseId, userId);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async importExpenses(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { source } = req.body;

    if (!source) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Source is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const result = await this.expenseService.importExpenses(userId, source);
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

      const summary = await this.expenseService.getSummary(
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

