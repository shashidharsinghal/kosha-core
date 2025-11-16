"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = require("../../repositories/mongodb/notifications/notification.repository");
const notification_preferences_repository_1 = require("../../repositories/mongodb/notifications/notification-preferences.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class NotificationService {
    constructor() {
        this.notificationRepository = new notification_repository_1.NotificationRepository();
        this.preferencesRepository = new notification_preferences_repository_1.NotificationPreferencesRepository();
    }
    async scheduleNotification(notificationData) {
        return await this.notificationRepository.create({
            ...notificationData,
            status: 'SCHEDULED',
        });
    }
    async sendNotification(notificationId) {
        const notification = await this.notificationRepository.findById(notificationId);
        if (!notification) {
            throw new errorHandler_1.AppError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
        }
        const preferences = await this.preferencesRepository.findByUserId(notification.userId);
        // Check DND settings
        if (preferences && this.isInDND(notification.scheduledAt, preferences)) {
            // Reschedule for after DND
            const dndEnd = this.getDNDEndTime(notification.scheduledAt, preferences);
            await this.notificationRepository.update(notificationId, { scheduledAt: dndEnd });
            return { success: false }; // Not sent, rescheduled
        }
        try {
            // TODO: Send via appropriate channel (email, SMS, push)
            await this.sendViaChannel(notification, preferences);
            await this.notificationRepository.markAsSent(notificationId);
            return { success: true };
        }
        catch (error) {
            await this.notificationRepository.markAsFailed(notificationId);
            throw new errorHandler_1.AppError(500, 'SEND_FAILED', 'Failed to send notification');
        }
    }
    async getPreferences(userId) {
        return await this.preferencesRepository.findOrCreate(userId);
    }
    async updatePreferences(userId, preferences) {
        return await this.preferencesRepository.update(userId, preferences);
    }
    async listNotifications(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { notifications, total } = await this.notificationRepository.findByUserId(userId, filters, pagination);
        return { notifications, total, page: pagination.page, limit: pagination.limit };
    }
    isInDND(scheduledAt, preferences) {
        if (!preferences || !preferences.dndStart || !preferences.dndEnd) {
            return false;
        }
        const [startHour, startMin] = preferences.dndStart.split(':').map(Number);
        const [endHour, endMin] = preferences.dndEnd.split(':').map(Number);
        const scheduled = new Date(scheduledAt);
        const scheduledHour = scheduled.getHours();
        const scheduledMin = scheduled.getMinutes();
        const scheduledTime = scheduledHour * 60 + scheduledMin;
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        if (startTime < endTime) {
            return scheduledTime >= startTime && scheduledTime < endTime;
        }
        else {
            // DND spans midnight
            return scheduledTime >= startTime || scheduledTime < endTime;
        }
    }
    getDNDEndTime(scheduledAt, preferences) {
        const [endHour, endMin] = preferences.dndEnd.split(':').map(Number);
        const endTime = new Date(scheduledAt);
        endTime.setHours(endHour, endMin, 0, 0);
        if (endTime <= scheduledAt) {
            endTime.setDate(endTime.getDate() + 1);
        }
        return endTime;
    }
    async sendViaChannel(notification, preferences) {
        const channels = preferences?.channels || ['EMAIL'];
        if (!channels.includes(notification.channel)) {
            throw new Error(`Channel ${notification.channel} not enabled for user`);
        }
        // TODO: Implement actual sending logic
        // - Email: Use Gmail API or SMTP
        // - SMS: Use Twilio or similar
        // - Push: Use Firebase Cloud Messaging
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map