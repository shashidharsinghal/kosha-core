import { Response } from 'express';
import { NotificationService } from '../../services/notifications/notification.service';
import { ApiResponse, PaginatedResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async scheduleNotification(req: AuthRequest, res: Response): Promise<void> {
    const notificationData = req.body;

    try {
      const notification = await this.notificationService.scheduleNotification(notificationData);
      res.status(201).json({ data: notification } as ApiResponse<typeof notification>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async sendNotification(req: AuthRequest, res: Response): Promise<void> {
    const { notificationId } = req.params;

    try {
      const result = await this.notificationService.sendNotification(notificationId);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async getPreferences(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;

    try {
      const preferences = await this.notificationService.getPreferences(userId);
      res.status(200).json({ data: preferences } as ApiResponse<typeof preferences>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async updatePreferences(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const preferences = req.body;

    try {
      const updated = await this.notificationService.updatePreferences(userId, preferences);
      res.status(200).json({ data: updated } as ApiResponse<typeof updated>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async listNotifications(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const {
      status,
      type,
      startDate,
      endDate,
      page = '1',
      limit = '20',
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
      };

      const result = await this.notificationService.listNotifications(userId, filters, pagination);
      res.status(200).json({
        data: result.notifications,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      } as PaginatedResponse<typeof result.notifications[0]>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

