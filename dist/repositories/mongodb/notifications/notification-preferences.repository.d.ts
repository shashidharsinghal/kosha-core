import { INotificationPreferences } from '../../../models/mongodb/notifications/notification-preferences.schema';
export declare class NotificationPreferencesRepository {
    findOrCreate(userId: string): Promise<INotificationPreferences>;
    findByUserId(userId: string): Promise<INotificationPreferences | null>;
    update(userId: string, updates: Partial<INotificationPreferences>): Promise<INotificationPreferences>;
}
//# sourceMappingURL=notification-preferences.repository.d.ts.map