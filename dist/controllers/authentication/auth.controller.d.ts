import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class AuthController {
    private authService;
    constructor();
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    linkGmail(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map