"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notification_schema_1 = require("../../../models/mongodb/notifications/notification.schema");
class NotificationRepository {
    async create(notificationData) {
        const notification = new notification_schema_1.Notification(notificationData);
        return await notification.save();
    }
    async findById(id) {
        return await notification_schema_1.Notification.findById(id);
    }
    async findByUserId(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const query = { userId };
        if (filters.status)
            query.status = filters.status;
        if (filters.type)
            query.type = filters.type;
        if (filters.startDate || filters.endDate) {
            query.scheduledAt = {};
            if (filters.startDate)
                query.scheduledAt.$gte = filters.startDate;
            if (filters.endDate)
                query.scheduledAt.$lte = filters.endDate;
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [notifications, total] = await Promise.all([
            notification_schema_1.Notification.find(query).sort({ scheduledAt: -1 }).skip(skip).limit(pagination.limit),
            notification_schema_1.Notification.countDocuments(query),
        ]);
        return { notifications, total };
    }
    async findPending() {
        const now = new Date();
        return await notification_schema_1.Notification.find({
            status: 'SCHEDULED',
            scheduledAt: { $lte: now },
        });
    }
    async update(id, updates) {
        return await notification_schema_1.Notification.findByIdAndUpdate(id, updates, { new: true });
    }
    async markAsSent(id) {
        await notification_schema_1.Notification.findByIdAndUpdate(id, { status: 'SENT', sentAt: new Date() });
    }
    async markAsFailed(id) {
        await notification_schema_1.Notification.findByIdAndUpdate(id, { status: 'FAILED' });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map