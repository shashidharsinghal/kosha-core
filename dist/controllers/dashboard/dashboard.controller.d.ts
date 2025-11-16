import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class DashboardController {
    private dashboardService;
    constructor();
    getSummary(req: AuthRequest, res: Response): Promise<void>;
    getHealthMetrics(req: AuthRequest, res: Response): Promise<void>;
    getTrends(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map