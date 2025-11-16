import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    userId: string;
    type: 'BILL_REMINDER' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'SUMMARY' | 'INCOME_ALERT' | 'EXPENSE_ALERT';
    channel: 'EMAIL' | 'SMS' | 'PUSH';
    message: string;
    scheduledAt: Date;
    sentAt?: Date;
    status: 'SCHEDULED' | 'SENT' | 'FAILED';
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification> & INotification & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=notification.schema.d.ts.map