import { NotificationRepository } from '../../repositories/mongodb/notifications/notification.repository';
import { NotificationPreferencesRepository } from '../../repositories/mongodb/notifications/notification-preferences.repository';
import { AppError } from '../../middleware/errorHandler';
import { INotification } from '../../models/mongodb/notifications/notification.schema';
import { INotificationPreferences } from '../../models/mongodb/notifications/notification-preferences.schema';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private preferencesRepository: NotificationPreferencesRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.preferencesRepository = new NotificationPreferencesRepository();
  }

  async scheduleNotification(notificationData: Partial<INotification>): Promise<INotification> {
    return await this.notificationRepository.create({
      ...notificationData,
      status: 'SCHEDULED',
    });
  }

  async sendNotification(notificationId: string): Promise<{ success: boolean }> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) {
      throw new AppError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
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
    } catch (error) {
      await this.notificationRepository.markAsFailed(notificationId);
      throw new AppError(500, 'SEND_FAILED', 'Failed to send notification');
    }
  }

  async getPreferences(userId: string): Promise<INotificationPreferences> {
    return await this.preferencesRepository.findOrCreate(userId);
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<INotificationPreferences>
  ): Promise<INotificationPreferences> {
    return await this.preferencesRepository.update(userId, preferences);
  }

  async listNotifications(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{
    notifications: INotification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { notifications, total } = await this.notificationRepository.findByUserId(userId, filters, pagination);
    return { notifications, total, page: pagination.page, limit: pagination.limit };
  }

  private isInDND(scheduledAt: Date, preferences: INotificationPreferences | null): boolean {
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
    } else {
      // DND spans midnight
      return scheduledTime >= startTime || scheduledTime < endTime;
    }
  }

  private getDNDEndTime(scheduledAt: Date, preferences: INotificationPreferences): Date {
    const [endHour, endMin] = preferences.dndEnd!.split(':').map(Number);
    const endTime = new Date(scheduledAt);
    endTime.setHours(endHour, endMin, 0, 0);
    
    if (endTime <= scheduledAt) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    return endTime;
  }

  private async sendViaChannel(
    notification: INotification,
    preferences: INotificationPreferences | null
  ): Promise<void> {
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

