import mongoose, { Document } from 'mongoose';
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
export declare const Expense: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense> & IExpense & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=expense.schema.d.ts.map