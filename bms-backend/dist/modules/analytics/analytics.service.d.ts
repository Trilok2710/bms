export declare class AnalyticsService {
    getOrgStats(orgId: string): Promise<{
        totalReadings: number;
        approvedReadings: number;
        pendingReadings: number;
        rejectedReadings: number;
        taskCount: number;
        buildingCount: number;
        approvalRate: string | number;
    }>;
    getCategoryStats(orgId: string, categoryId: string): Promise<{
        totalReadings: number;
        approvedReadings: number;
        pendingReadings: number;
        averageValue: number;
        recentReadings: {
            status: import(".prisma/client").$Enums.ReadingStatus;
            value: number;
            submittedAt: Date;
            submittedBy: {
                firstName: string;
                lastName: string;
            };
        }[];
    }>;
    getBuildingStats(orgId: string, buildingId: string): Promise<{
        totalReadings: number;
        categoryCount: number;
        taskCount: number;
        categories: {
            id: string;
            name: string;
            readingCount: number;
        }[];
        recentTasks: ({
            _count: {
                readings: number;
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
        })[];
    }>;
    getReadingTrend(orgId: string, categoryId: string, days?: number): Promise<any[]>;
    getStaffPerformance(orgId: string): Promise<{
        id: string;
        name: string;
        email: string;
        totalReadings: number;
        readingStats: {
            approved: number;
            pending: number;
            rejected: number;
        };
    }[]>;
}
declare const _default: AnalyticsService;
export default _default;
//# sourceMappingURL=analytics.service.d.ts.map