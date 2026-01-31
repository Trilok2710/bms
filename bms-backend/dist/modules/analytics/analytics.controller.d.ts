import { Request, Response } from 'express';
export declare class AnalyticsController {
    getOrgStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategoryStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBuildingStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReadingTrend(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStaffPerformance(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: AnalyticsController;
export default _default;
//# sourceMappingURL=analytics.controller.d.ts.map