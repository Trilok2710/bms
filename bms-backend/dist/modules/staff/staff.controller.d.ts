import { Request, Response } from 'express';
export declare class StaffController {
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    invite(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deactivate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: StaffController;
export default _default;
//# sourceMappingURL=staff.controller.d.ts.map