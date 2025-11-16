import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class BillController {
    private billService;
    constructor();
    upsertBill(req: AuthRequest, res: Response): Promise<void>;
    listBills(req: AuthRequest, res: Response): Promise<void>;
    listUpcomingBills(req: AuthRequest, res: Response): Promise<void>;
    markBillPaid(req: AuthRequest, res: Response): Promise<void>;
    importBills(req: AuthRequest, res: Response): Promise<void>;
    getRecurringSuggestions(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=bill.controller.d.ts.map