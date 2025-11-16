"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferencesRepository = void 0;
const notification_preferences_schema_1 = require("../../../models/mongodb/notifications/notification-preferences.schema");
class NotificationPreferencesRepository {
    async findOrCreate(userId) {
        let preferences = await notification_preferences_schema_1.NotificationPreferences.findOne({ userId });
        if (!preferences) {
            preferences = new notification_preferences_schema_1.NotificationPreferences({
                userId,
                channels: ['EMAIL'],
            });
            await preferences.save();
        }
        return preferences;
    }
    async findByUserId(userId) {
        return await notification_preferences_schema_1.NotificationPreferences.findOne({ userId });
    }
    async update(userId, updates) {
        const preferences = await this.findOrCreate(userId);
        Object.assign(preferences, updates);
        return await preferences.save();
    }
}
exports.NotificationPreferencesRepository = NotificationPreferencesRepository;
//# sourceMappingURL=notification-preferences.repository.js.map