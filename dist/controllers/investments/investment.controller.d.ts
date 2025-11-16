import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class InvestmentController {
    private investmentService;
    constructor();
    addAsset(req: AuthRequest, res: Response): Promise<void>;
    updateAsset(req: AuthRequest, res: Response): Promise<void>;
    addTransaction(req: AuthRequest, res: Response): Promise<void>;
    updateTransaction(req: AuthRequest, res: Response): Promise<void>;
    deleteTransaction(req: AuthRequest, res: Response): Promise<void>;
    listInvestments(req: AuthRequest, res: Response): Promise<void>;
    fetchLivePrice(req: AuthRequest, res: Response): Promise<void>;
    getPortfolioSummary(req: AuthRequest, res: Response): Promise<void>;
    getPriceHistory(req: AuthRequest, res: Response): Promise<void>;
    getTransactionHistory(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=investment.controller.d.ts.map