import mongoose, { Document } from 'mongoose';
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
export declare const Income: mongoose.Model<IIncome, {}, {}, {}, mongoose.Document<unknown, {}, IIncome> & IIncome & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=income.schema.d.ts.map