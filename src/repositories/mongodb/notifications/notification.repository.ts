import { Notification, INotification } from '../../../models/mongodb/notifications/notification.schema';

export class NotificationRepository {
  async create(notificationData: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async findById(id: string): Promise<INotification | null> {
    return await Notification.findById(id);
  }

  async findByUserId(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ notifications: INotification[]; total: number }> {
    const query: any = { userId };

    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.startDate || filters.endDate) {
      query.scheduledAt = {};
      if (filters.startDate) query.scheduledAt.$gte = filters.startDate;
      if (filters.endDate) query.scheduledAt.$lte = filters.endDate;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [notifications, total] = await Promise.all([
      Notification.find(query).sort({ scheduledAt: -1 }).skip(skip).limit(pagination.limit),
      Notification.countDocuments(query),
    ]);

    return { notifications, total };
  }

  async findPending(): Promise<INotification[]> {
    const now = new Date();
    return await Notification.find({
      status: 'SCHEDULED',
      scheduledAt: { $lte: now },
    });
  }

  async update(id: string, updates: Partial<INotification>): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, updates, { new: true });
  }

  async markAsSent(id: string): Promise<void> {
    await Notification.findByIdAndUpdate(id, { status: 'SENT', sentAt: new Date() });
  }

  async markAsFailed(id: string): Promise<void> {
    await Notification.findByIdAndUpdate(id, { status: 'FAILED' });
  }
}

