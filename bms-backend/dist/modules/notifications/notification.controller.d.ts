import { Request, Response } from 'express';
export declare class NotificationController {
    getNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUnreadCount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAllAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: NotificationController;
export default _default;
//# sourceMappingURL=notification.controller.d.ts.map