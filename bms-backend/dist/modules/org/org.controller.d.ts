import { Request, Response } from 'express';
export declare class OrgController {
    getDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getInviteCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    regenerateInviteCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deactivateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: OrgController;
export default _default;
//# sourceMappingURL=org.controller.d.ts.map