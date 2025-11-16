import { IBill } from '../../models/mongodb/bills/bill.schema';
export declare class BillService {
    private billRepository;
    constructor();
    upsertBill(userId: string, billData: Partial<IBill>): Promise<IBill>;
    listBills(userId: string, filters?: {
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
        page: number;
        limit: number;
    }>;
    listUpcomingBills(userId: string, days?: number): Promise<IBill[]>;
    markBillPaid(billId: string, paymentId: string, userId: string): Promise<IBill>;
    importBills(userId: string, source?: 'GMAIL' | 'SMS'): Promise<{
        imported: number;
        failed: number;
    }>;
    getRecurringSuggestions(userId: string): Promise<IBill[]>;
}
//# sourceMappingURL=bill.service.d.ts.map