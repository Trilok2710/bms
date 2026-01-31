import { BadRequestError } from '../../utils/errors';
import { CreateReadingInput, AddReadingCommentInput } from './reading.types';
export declare class ReadingService {
    submitReading(orgId: string, userId: string, input: CreateReadingInput): Promise<BadRequestError | ({
        category: {
            name: string;
            unit: string | null;
        };
        task: {
            title: string;
        };
        submittedBy: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: import(".prisma/client").$Enums.ReadingStatus;
        value: number;
        buildingId: string;
        categoryId: string;
        notes: string | null;
        taskId: string;
        submittedAt: Date;
        approvedAt: Date | null;
        submittedById: string;
    })>;
    getAllReadings(orgId: string, page?: string, limit?: string): Promise<{
        data: {
            readings: ({
                building: {
                    name: string;
                };
                category: {
                    name: string;
                    unit: string | null;
                };
                task: {
                    title: string;
                };
                submittedBy: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                status: import(".prisma/client").$Enums.ReadingStatus;
                value: number;
                buildingId: string;
                categoryId: string;
                notes: string | null;
                taskId: string;
                submittedAt: Date;
                approvedAt: Date | null;
                submittedById: string;
            })[];
            pagination: {
                total: number;
                pages: number;
                skip: number;
                take: number;
            };
        };
    }>;
    getPendingReadings(orgId: string, page?: string, limit?: string): Promise<{
        readings: ({
            building: {
                name: string;
            };
            category: {
                name: string;
                unit: string | null;
            };
            task: {
                title: string;
            };
            submittedBy: {
                email: string;
                firstName: string;
                lastName: string;
            };
            comments: ({
                user: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                comment: string;
                userId: string;
                readingId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            buildingId: string;
            categoryId: string;
            notes: string | null;
            taskId: string;
            submittedAt: Date;
            approvedAt: Date | null;
            submittedById: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    approveReading(orgId: string, userId: string, readingId: string, comment?: string): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            comment: string;
            userId: string;
            readingId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: import(".prisma/client").$Enums.ReadingStatus;
        value: number;
        buildingId: string;
        categoryId: string;
        notes: string | null;
        taskId: string;
        submittedAt: Date;
        approvedAt: Date | null;
        submittedById: string;
    }>;
    rejectReading(orgId: string, userId: string, readingId: string, comment?: string): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            comment: string;
            userId: string;
            readingId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: import(".prisma/client").$Enums.ReadingStatus;
        value: number;
        buildingId: string;
        categoryId: string;
        notes: string | null;
        taskId: string;
        submittedAt: Date;
        approvedAt: Date | null;
        submittedById: string;
    }>;
    addComment(orgId: string, userId: string, readingId: string, input: AddReadingCommentInput): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        comment: string;
        userId: string;
        readingId: string;
    }>;
    getReadingsByCategory(orgId: string, buildingId: string, categoryId: string, page?: string, limit?: string): Promise<{
        readings: ({
            submittedBy: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            buildingId: string;
            categoryId: string;
            notes: string | null;
            taskId: string;
            submittedAt: Date;
            approvedAt: Date | null;
            submittedById: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getUserReadingHistory(orgId: string, userId: string, page?: string, limit?: string): Promise<{
        readings: ({
            building: {
                name: string;
            };
            category: {
                name: string;
                unit: string | null;
            };
            task: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            buildingId: string;
            categoryId: string;
            notes: string | null;
            taskId: string;
            submittedAt: Date;
            approvedAt: Date | null;
            submittedById: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
}
declare const _default: ReadingService;
export default _default;
//# sourceMappingURL=reading.service.d.ts.map