import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class IncomeController {
    private incomeService;
    constructor();
    addIncome(req: AuthRequest, res: Response): Promise<void>;
    updateIncome(req: AuthRequest, res: Response): Promise<void>;
    listIncomes(req: AuthRequest, res: Response): Promise<void>;
    deleteIncome(req: AuthRequest, res: Response): Promise<void>;
    importIncomes(req: AuthRequest, res: Response): Promise<void>;
    getSummary(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=income.controller.d.ts.map