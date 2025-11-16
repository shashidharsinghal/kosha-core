import mongoose, { Document } from 'mongoose';
export interface INotificationPreferences extends Document {
    userId: string;
    channels: string[];
    dndStart?: string;
    dndEnd?: string;
    timezone?: string;
    weeklySummaryDay?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationPreferences: mongoose.Model<INotificationPreferences, {}, {}, {}, mongoose.Document<unknown, {}, INotificationPreferences> & INotificationPreferences & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=notification-preferences.schema.d.ts.map