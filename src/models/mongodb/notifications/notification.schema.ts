import mongoose, { Schema, Document } from 'mongoose';

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

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['BILL_REMINDER', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'SUMMARY', 'INCOME_ALERT', 'EXPENSE_ALERT'],
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ['EMAIL', 'SMS', 'PUSH'],
      required: true,
    },
    message: { type: String, required: true },
    scheduledAt: { type: Date, required: true, index: true },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ['SCHEDULED', 'SENT', 'FAILED'],
      default: 'SCHEDULED',
      index: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

