import { IBill } from '../../../models/mongodb/bills/bill.schema';
export declare class BillRepository {
    create(billData: Partial<IBill>): Promise<IBill>;
    findById(id: string): Promise<IBill | null>;
    findByUserId(userId: string, filters?: {
        status?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
    }, pagination?: {
        page: number;
        limit: number;
        sort?: string;
    }): Promise<{
        bills: IBill[];
        total: number;
    }>;
    findUpcoming(userId: string, days?: number): Promise<IBill[]>;
    update(id: string, updates: Partial<IBill>): Promise<IBill | null>;
    delete(id: string): Promise<void>;
    findRecurringPatterns(userId: string): Promise<IBill[]>;
}
//# sourceMappingURL=bill.repository.d.ts.map