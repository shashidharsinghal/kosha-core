"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../../controllers/notifications/notification.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => notificationController.listNotifications(req, res));
router.get('/preferences', (req, res) => notificationController.getPreferences(req, res));
router.post('/', (req, res) => notificationController.scheduleNotification(req, res));
router.post('/preferences', (req, res) => notificationController.updatePreferences(req, res));
router.post('/:notificationId/send', (req, res) => notificationController.sendNotification(req, res));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map