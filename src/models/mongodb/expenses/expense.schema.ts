import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: string;
  description: string;
  category: string;
  amount: number;
  spentAt: Date;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'OTHER';
  notes?: string;
  source?: 'MANUAL' | 'UPI' | 'SMS' | 'CARD';
  recurrence?: {
    frequency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    spentAt: { type: Date, required: true, index: true },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD', 'UPI', 'OTHER'],
      required: true,
    },
    notes: { type: String },
    source: {
      type: String,
      enum: ['MANUAL', 'UPI', 'SMS', 'CARD'],
    },
    recurrence: {
      type: {
        frequency: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

