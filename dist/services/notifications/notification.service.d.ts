import { INotification } from '../../models/mongodb/notifications/notification.schema';
import { INotificationPreferences } from '../../models/mongodb/notifications/notification-preferences.schema';
export declare class NotificationService {
    private notificationRepository;
    private preferencesRepository;
    constructor();
    scheduleNotification(notificationData: Partial<INotification>): Promise<INotification>;
    sendNotification(notificationId: string): Promise<{
        success: boolean;
    }>;
    getPreferences(userId: string): Promise<INotificationPreferences>;
    updatePreferences(userId: string, preferences: Partial<INotificationPreferences>): Promise<INotificationPreferences>;
    listNotifications(userId: string, filters?: {
        status?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
    }, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        notifications: INotification[];
        total: number;
        page: number;
        limit: number;
    }>;
    private isInDND;
    private getDNDEndTime;
    private sendViaChannel;
}
//# sourceMappingURL=notification.service.d.ts.map