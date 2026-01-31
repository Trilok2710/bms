import { CreateStaffInput } from './staff.types';
export declare class StaffService {
    getAllStaff(orgId: string, skip: number, take: number): Promise<{
        name: string;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    countStaff(orgId: string): Promise<number>;
    inviteStaff(orgId: string, userId: string, input: CreateStaffInput): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    getStaffByRole(orgId: string, role: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        _count: {
            readings: number;
            assignedTasks: number;
        };
    }[]>;
    getStaffById(orgId: string, staffId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        readings: {
            id: string;
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            submittedAt: Date;
        }[];
        assignedTasks: ({
            task: {
                title: string;
                frequency: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            userId: string;
        })[];
    }>;
    updateStaffRole(orgId: string, userId: string, staffId: string, newRole: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    deactivateStaff(orgId: string, userId: string, staffId: string): Promise<{
        message: string;
        staff: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
        };
    }>;
}
declare const _default: StaffService;
export default _default;
//# sourceMappingURL=staff.service.d.ts.map