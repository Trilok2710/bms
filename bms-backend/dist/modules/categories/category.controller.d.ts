import { Request, Response } from 'express';
export declare class CategoryController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByBuilding(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: CategoryController;
export default _default;
//# sourceMappingURL=category.controller.d.ts.map