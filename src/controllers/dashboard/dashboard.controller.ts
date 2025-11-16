import { Response } from 'express';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ApiResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    try {
      const summary = await this.dashboardService.getSummary(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.status(200).json({ data: summary } as ApiResponse<typeof summary>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getHealthMetrics(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { period = 'MONTH' } = req.query;

    try {
      const metrics = await this.dashboardService.getHealthMetrics(
        userId,
        period as 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'
      );
      res.status(200).json({ data: metrics } as ApiResponse<typeof metrics>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getTrends(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { period = 'MONTH', metric = 'EXPENSE' } = req.query;

    try {
      const trends = await this.dashboardService.getTrends(
        userId,
        period as 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR',
        metric as 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'INVESTMENT'
      );
      res.status(200).json({ data: trends } as ApiResponse<typeof trends>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

