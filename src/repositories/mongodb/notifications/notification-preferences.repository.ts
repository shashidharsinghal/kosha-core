import {
  NotificationPreferences,
  INotificationPreferences,
} from '../../../models/mongodb/notifications/notification-preferences.schema';

export class NotificationPreferencesRepository {
  async findOrCreate(userId: string): Promise<INotificationPreferences> {
    let preferences = await NotificationPreferences.findOne({ userId });
    if (!preferences) {
      preferences = new NotificationPreferences({
        userId,
        channels: ['EMAIL'],
      });
      await preferences.save();
    }
    return preferences;
  }

  async findByUserId(userId: string): Promise<INotificationPreferences | null> {
    return await NotificationPreferences.findOne({ userId });
  }

  async update(userId: string, updates: Partial<INotificationPreferences>): Promise<INotificationPreferences> {
    const preferences = await this.findOrCreate(userId);
    Object.assign(preferences, updates);
    return await preferences.save();
  }
}

