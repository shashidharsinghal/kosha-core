import { INotification } from '../../../models/mongodb/notifications/notification.schema';
export declare class NotificationRepository {
    create(notificationData: Partial<INotification>): Promise<INotification>;
    findById(id: string): Promise<INotification | null>;
    findByUserId(userId: string, filters?: {
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
    }>;
    findPending(): Promise<INotification[]>;
    update(id: string, updates: Partial<INotification>): Promise<INotification | null>;
    markAsSent(id: string): Promise<void>;
    markAsFailed(id: string): Promise<void>;
}
//# sourceMappingURL=notification.repository.d.ts.map