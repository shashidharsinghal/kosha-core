import mongoose, { Schema, Document } from 'mongoose';

export interface IBill extends Document {
  userId: string;
  title: string;
  type: 'LOAN' | 'SUBSCRIPTION' | 'CREDIT_CARD' | 'UTILITY' | 'OTHER';
  provider?: string;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  autopay: boolean;
  autopayMandateId?: string;
  source?: 'GMAIL' | 'SMS' | 'MANUAL';
  recurrence?: {
    frequency: string;
    day?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<IBill>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['LOAN', 'SUBSCRIPTION', 'CREDIT_CARD', 'UTILITY', 'OTHER'],
      required: true,
    },
    provider: { type: String },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'OVERDUE'],
      default: 'PENDING',
      index: true,
    },
    autopay: { type: Boolean, default: false },
    autopayMandateId: { type: String },
    source: {
      type: String,
      enum: ['GMAIL', 'SMS', 'MANUAL'],
    },
    recurrence: {
      type: {
        frequency: String,
        day: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = mongoose.model<IBill>('Bill', BillSchema);

