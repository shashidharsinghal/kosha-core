"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../../services/dashboard/dashboard.service");
class DashboardController {
    constructor() {
        this.dashboardService = new dashboard_service_1.DashboardService();
    }
    async getSummary(req, res) {
        const userId = req.userId;
        const { startDate, endDate } = req.query;
        try {
            const summary = await this.dashboardService.getSummary(userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.status(200).json({ data: summary });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getHealthMetrics(req, res) {
        const userId = req.userId;
        const { period = 'MONTH' } = req.query;
        try {
            const metrics = await this.dashboardService.getHealthMetrics(userId, period);
            res.status(200).json({ data: metrics });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getTrends(req, res) {
        const userId = req.userId;
        const { period = 'MONTH', metric = 'EXPENSE' } = req.query;
        try {
            const trends = await this.dashboardService.getTrends(userId, period, metric);
            res.status(200).json({ data: trends });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map