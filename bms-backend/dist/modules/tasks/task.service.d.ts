import { CreateTaskInput, UpdateTaskInput } from './task.types';
export declare class TaskService {
    createTask(orgId: string, userId: string, input: CreateTaskInput): Promise<{
        assignments: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            userId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        buildingId: string;
        title: string;
        frequency: string;
        scheduledTime: string;
        categoryId: string;
        dueDate: Date | null;
    }>;
    getTasksByOrg(orgId: string, page?: string, limit?: string): Promise<{
        tasks: ({
            building: {
                id: string;
                name: string;
            };
            category: {
                id: string;
                name: string;
            };
            _count: {
                readings: number;
            };
            assignments: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                taskId: string;
                userId: string;
            })[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            description: string | null;
            buildingId: string;
            title: string;
            frequency: string;
            scheduledTime: string;
            categoryId: string;
            dueDate: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getTasksByUser(orgId: string, userId: string, page?: string, limit?: string): Promise<{
        tasks: ({
            building: {
                id: string;
                name: string;
            };
            category: {
                id: string;
                name: string;
                unit: string | null;
            };
            assignments: {
                userId: string;
            }[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            description: string | null;
            buildingId: string;
            title: string;
            frequency: string;
            scheduledTime: string;
            categoryId: string;
            dueDate: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getAvailableTasksForReading(orgId: string, userId: string): Promise<({
        building: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            name: string;
            unit: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        buildingId: string;
        title: string;
        frequency: string;
        scheduledTime: string;
        categoryId: string;
        dueDate: Date | null;
    })[]>;
    getTaskById(orgId: string, taskId: string): Promise<{
        building: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            description: string | null;
            location: string | null;
        };
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            description: string | null;
            unit: string | null;
            minValue: number | null;
            maxValue: number | null;
            buildingId: string;
        };
        readings: {
            id: string;
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            submittedAt: Date;
            submittedBy: {
                firstName: string;
                lastName: string;
            };
        }[];
        assignments: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            userId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        buildingId: string;
        title: string;
        frequency: string;
        scheduledTime: string;
        categoryId: string;
        dueDate: Date | null;
    }>;
    updateTask(orgId: string, userId: string, taskId: string, input: UpdateTaskInput): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        buildingId: string;
        title: string;
        frequency: string;
        scheduledTime: string;
        categoryId: string;
        dueDate: Date | null;
    }>;
    assignTask(orgId: string, userId: string, taskId: string, assignedUserIds: string[]): Promise<({
        assignments: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            userId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        buildingId: string;
        title: string;
        frequency: string;
        scheduledTime: string;
        categoryId: string;
        dueDate: Date | null;
    }) | null>;
    deleteTask(orgId: string, userId: string, taskId: string): Promise<{
        message: string;
        task: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            description: string | null;
            buildingId: string;
            title: string;
            frequency: string;
            scheduledTime: string;
            categoryId: string;
            dueDate: Date | null;
        };
    }>;
}
declare const _default: TaskService;
export default _default;
//# sourceMappingURL=task.service.d.ts.map