"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../../controllers/dashboard/dashboard.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/summary', (req, res) => dashboardController.getSummary(req, res));
router.get('/health-metrics', (req, res) => dashboardController.getHealthMetrics(req, res));
router.get('/trends', (req, res) => dashboardController.getTrends(req, res));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map