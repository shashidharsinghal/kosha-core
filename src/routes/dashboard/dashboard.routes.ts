import { Router } from 'express';
import { DashboardController } from '../../controllers/dashboard/dashboard.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.use(authenticateToken);

router.get('/summary', (req, res) => dashboardController.getSummary(req as any, res));
router.get('/health-metrics', (req, res) => dashboardController.getHealthMetrics(req as any, res));
router.get('/trends', (req, res) => dashboardController.getTrends(req as any, res));

export default router;

