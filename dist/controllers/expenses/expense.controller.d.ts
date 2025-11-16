import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class ExpenseController {
    private expenseService;
    constructor();
    addExpense(req: AuthRequest, res: Response): Promise<void>;
    updateExpense(req: AuthRequest, res: Response): Promise<void>;
    listExpenses(req: AuthRequest, res: Response): Promise<void>;
    deleteExpense(req: AuthRequest, res: Response): Promise<void>;
    importExpenses(req: AuthRequest, res: Response): Promise<void>;
    getSummary(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=expense.controller.d.ts.map