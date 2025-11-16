import mongoose, { Schema, Document } from 'mongoose';

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

const NotificationPreferencesSchema = new Schema<INotificationPreferences>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    channels: [{ type: String }],
    dndStart: { type: String },
    dndEnd: { type: String },
    timezone: { type: String },
    weeklySummaryDay: { type: Number, min: 0, max: 6 },
  },
  {
    timestamps: true,
  }
);

export const NotificationPreferences = mongoose.model<INotificationPreferences>(
  'NotificationPreferences',
  NotificationPreferencesSchema
);

