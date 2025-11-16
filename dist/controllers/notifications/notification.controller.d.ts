import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class NotificationController {
    private notificationService;
    constructor();
    scheduleNotification(req: AuthRequest, res: Response): Promise<void>;
    sendNotification(req: AuthRequest, res: Response): Promise<void>;
    getPreferences(req: AuthRequest, res: Response): Promise<void>;
    updatePreferences(req: AuthRequest, res: Response): Promise<void>;
    listNotifications(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map