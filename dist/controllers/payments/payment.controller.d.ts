import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class PaymentController {
    private paymentService;
    constructor();
    linkUPIAccount(req: AuthRequest, res: Response): Promise<void>;
    listAccounts(req: AuthRequest, res: Response): Promise<void>;
    createAutopayMandate(req: AuthRequest, res: Response): Promise<void>;
    listMandates(req: AuthRequest, res: Response): Promise<void>;
    updateMandate(req: AuthRequest, res: Response): Promise<void>;
    payBill(req: AuthRequest, res: Response): Promise<void>;
    listPayments(req: AuthRequest, res: Response): Promise<void>;
    getPaymentStatus(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map