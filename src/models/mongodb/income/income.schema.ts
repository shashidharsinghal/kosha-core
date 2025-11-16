import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
  userId: string;
  source: string;
  amount: number;
  receivedAt: Date;
  category?: string;
  notes?: string;
  importSource?: 'MANUAL' | 'GMAIL';
  recurrence?: {
    frequency: string;
    day?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema = new Schema<IIncome>(
  {
    userId: { type: String, required: true, index: true },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    receivedAt: { type: Date, required: true, index: true },
    category: { type: String, index: true },
    notes: { type: String },
    importSource: {
      type: String,
      enum: ['MANUAL', 'GMAIL'],
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

export const Income = mongoose.model<IIncome>('Income', IncomeSchema);

