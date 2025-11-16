import mongoose, { Document } from 'mongoose';
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
export declare const Bill: mongoose.Model<IBill, {}, {}, {}, mongoose.Document<unknown, {}, IBill> & IBill & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=bill.schema.d.ts.map