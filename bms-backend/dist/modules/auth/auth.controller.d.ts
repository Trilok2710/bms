import { Request, Response } from 'express';
export declare class AuthController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map