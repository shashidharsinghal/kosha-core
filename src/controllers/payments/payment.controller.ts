import { Response } from 'express';
import { PaymentService } from '../../services/payments/payment.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async linkUPIAccount(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { provider, oauthCode } = req.body;

    if (!provider || !oauthCode) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Provider and OAuth code are required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const account = await this.paymentService.linkUPIAccount(userId, provider, oauthCode);
      res.status(201).json({ data: account } as ApiResponse<typeof account>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listAccounts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;

    try {
      const accounts = await this.paymentService.listAccounts(userId);
      res.status(200).json({ data: accounts } as ApiResponse<typeof accounts>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async createAutopayMandate(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { billId, upiAccountId, frequency } = req.body;

    if (!billId || !upiAccountId || !frequency) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Bill ID, UPI account ID, and frequency are required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const mandate = await this.paymentService.createAutopayMandate(billId, upiAccountId, frequency, userId);
      res.status(201).json({ data: mandate } as ApiResponse<typeof mandate>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listMandates(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { status } = req.query;

    try {
      const mandates = await this.paymentService.listMandates(userId, status as string | undefined);
      res.status(200).json({ data: mandates } as ApiResponse<typeof mandates>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updateMandate(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { mandateId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Status is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const mandate = await this.paymentService.updateMandate(mandateId, status, userId);
      res.status(200).json({ data: mandate } as ApiResponse<typeof mandate>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async payBill(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { billId } = req.params;
    const { paymentMethod, upiAccountId, idempotencyKey } = req.body;

    if (!paymentMethod) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Payment method is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const payment = await this.paymentService.payBill(billId, paymentMethod, userId, upiAccountId, idempotencyKey);
      res.status(202).json({ data: payment } as ApiResponse<typeof payment>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listPayments(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const {
      billId,
      status,
      startDate,
      endDate,
      page = '1',
      limit = '20',
    } = req.query;

    try {
      const filters: any = {};
      if (billId) filters.billId = billId;
      if (status) filters.status = status;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await this.paymentService.listPayments(userId, filters, pagination);
      res.status(200).json({
        data: result.payments,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.payments[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getPaymentStatus(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { paymentId } = req.params;

    try {
      const payment = await this.paymentService.getPaymentStatus(paymentId, userId);
      res.status(200).json({ data: payment } as ApiResponse<typeof payment>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

