import { Request, Response } from 'express';
export declare class TaskController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyTasks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    assignUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAvailableTasksForReading(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: TaskController;
export default _default;
//# sourceMappingURL=task.controller.d.ts.map