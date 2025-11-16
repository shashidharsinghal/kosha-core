"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../../services/notifications/notification.service");
class NotificationController {
    constructor() {
        this.notificationService = new notification_service_1.NotificationService();
    }
    async scheduleNotification(req, res) {
        const notificationData = req.body;
        try {
            const notification = await this.notificationService.scheduleNotification(notificationData);
            res.status(201).json({ data: notification });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async sendNotification(req, res) {
        const { notificationId } = req.params;
        try {
            const result = await this.notificationService.sendNotification(notificationId);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getPreferences(req, res) {
        const userId = req.userId;
        try {
            const preferences = await this.notificationService.getPreferences(userId);
            res.status(200).json({ data: preferences });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updatePreferences(req, res) {
        const userId = req.userId;
        const preferences = req.body;
        try {
            const updated = await this.notificationService.updatePreferences(userId, preferences);
            res.status(200).json({ data: updated });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listNotifications(req, res) {
        const userId = req.userId;
        const { status, type, startDate, endDate, page = '1', limit = '20', } = req.query;
        try {
            const filters = {};
            if (status)
                filters.status = status;
            if (type)
                filters.type = type;
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
            };
            const result = await this.notificationService.listNotifications(userId, filters, pagination);
            res.status(200).json({
                data: result.notifications,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map