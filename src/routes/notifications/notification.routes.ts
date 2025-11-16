import { Router } from 'express';
import { NotificationController } from '../../controllers/notifications/notification.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

// All routes require authentication
router.use(authenticateToken);

router.get('/', (req, res) => notificationController.listNotifications(req as any, res));
router.get('/preferences', (req, res) => notificationController.getPreferences(req as any, res));
router.post('/', (req, res) => notificationController.scheduleNotification(req as any, res));
router.post('/preferences', (req, res) => notificationController.updatePreferences(req as any, res));
router.post('/:notificationId/send', (req, res) => notificationController.sendNotification(req as any, res));

export default router;

