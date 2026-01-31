import { Request, Response } from 'express';
export declare class ReadingController {
    submit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPending(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    approve(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    reject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ReadingController;
export default _default;
//# sourceMappingURL=reading.controller.d.ts.map