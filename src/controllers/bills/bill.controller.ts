import { Response } from 'express';
import { BillService } from '../../services/bills/bill.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class BillController {
  private billService: BillService;

  constructor() {
    this.billService = new BillService();
  }

  async upsertBill(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const billData = req.body;

    try {
      const bill = await this.billService.upsertBill(userId, billData);
      res.status(201).json({ data: bill } as ApiResponse<typeof bill>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listBills(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const {
      status,
      type,
      startDate,
      endDate,
      page = '1',
      limit = '20',
      sort,
    } = req.query;

    try {
      const filters: any = {};
      if (status) filters.status = status;
      if (type) filters.type = type;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string | undefined,
      };

      const result = await this.billService.listBills(userId, filters, pagination);
      res.status(200).json({
        data: result.bills,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.bills[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listUpcomingBills(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    try {
      const bills = await this.billService.listUpcomingBills(userId, days);
      res.status(200).json({ data: bills } as ApiResponse<typeof bills>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async markBillPaid(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { billId } = req.params;
    const { paymentId } = req.body;

    if (!paymentId) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Payment ID is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const bill = await this.billService.markBillPaid(billId, paymentId, userId);
      res.status(200).json({ data: bill } as ApiResponse<typeof bill>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async importBills(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { source } = req.body;

    try {
      const result = await this.billService.importBills(userId, source);
      res.status(202).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getRecurringSuggestions(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;

    try {
      const suggestions = await this.billService.getRecurringSuggestions(userId);
      res.status(200).json({ data: suggestions } as ApiResponse<typeof suggestions>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

