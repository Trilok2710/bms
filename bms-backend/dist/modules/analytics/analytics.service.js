"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
class AnalyticsService {
    async getOrgStats(orgId) {
        try {
            const [totalReadings, approvedReadings, pendingReadings, rejectedReadings, taskStats, buildingStats] = await Promise.all([
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId },
                }),
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, status: 'APPROVED' },
                }),
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, status: 'PENDING' },
                }),
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, status: 'REJECTED' },
                }),
                prisma_1.prisma.task.count({
                    where: { organizationId: orgId },
                }),
                prisma_1.prisma.building.count({
                    where: { organizationId: orgId },
                }),
            ]);
            return {
                totalReadings,
                approvedReadings,
                pendingReadings,
                rejectedReadings,
                taskCount: taskStats,
                buildingCount: buildingStats,
                approvalRate: totalReadings > 0 ? ((approvedReadings / totalReadings) * 100).toFixed(2) : 0,
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getCategoryStats(orgId, categoryId) {
        try {
            const [totalReadings, approvedReadings, pendingReadings, avgValue] = await Promise.all([
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, categoryId },
                }),
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, categoryId, status: 'APPROVED' },
                }),
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, categoryId, status: 'PENDING' },
                }),
                prisma_1.prisma.reading.aggregate({
                    where: { organizationId: orgId, categoryId, status: 'APPROVED' },
                    _avg: { value: true },
                }),
            ]);
            const readings = await prisma_1.prisma.reading.findMany({
                where: { organizationId: orgId, categoryId },
                select: {
                    value: true,
                    status: true,
                    submittedAt: true,
                    submittedBy: {
                        select: { firstName: true, lastName: true },
                    },
                },
                orderBy: { submittedAt: 'desc' },
                take: 30,
            });
            return {
                totalReadings,
                approvedReadings,
                pendingReadings,
                averageValue: avgValue._avg.value || 0,
                recentReadings: readings,
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getBuildingStats(orgId, buildingId) {
        try {
            const [totalReadings, categories, tasks] = await Promise.all([
                prisma_1.prisma.reading.count({
                    where: { organizationId: orgId, buildingId },
                }),
                prisma_1.prisma.category.findMany({
                    where: { organizationId: orgId, buildingId },
                    include: {
                        _count: {
                            select: {
                                readings: {
                                    where: { status: 'APPROVED' },
                                },
                            },
                        },
                    },
                }),
                prisma_1.prisma.task.findMany({
                    where: { organizationId: orgId, buildingId },
                    include: {
                        _count: {
                            select: { readings: true },
                        },
                    },
                }),
            ]);
            return {
                totalReadings,
                categoryCount: categories.length,
                taskCount: tasks.length,
                categories: categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    readingCount: cat._count.readings,
                })),
                recentTasks: tasks.slice(0, 5),
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getReadingTrend(orgId, categoryId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const readings = await prisma_1.prisma.reading.findMany({
                where: {
                    organizationId: orgId,
                    categoryId,
                    submittedAt: {
                        gte: startDate,
                    },
                },
                select: {
                    value: true,
                    status: true,
                    submittedAt: true,
                },
                orderBy: { submittedAt: 'asc' },
            });
            // Group by date
            const trendData = readings.reduce((acc, reading) => {
                const date = reading.submittedAt.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = {
                        date,
                        values: [],
                        statuses: { APPROVED: 0, PENDING: 0, REJECTED: 0 },
                    };
                }
                acc[date].values.push(reading.value);
                acc[date].statuses[reading.status]++;
                return acc;
            }, {});
            return Object.values(trendData).map((item) => ({
                date: item.date,
                averageValue: (item.values.reduce((a, b) => a + b, 0) / item.values.length).toFixed(2),
                readingCount: item.values.length,
                ...item.statuses,
            }));
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getStaffPerformance(orgId) {
        try {
            const staff = await prisma_1.prisma.user.findMany({
                where: {
                    organizationId: orgId,
                    role: 'TECHNICIAN',
                },
                include: {
                    readings: {
                        select: { status: true },
                    },
                    _count: {
                        select: { readings: true },
                    },
                },
            });
            return staff.map(person => ({
                id: person.id,
                name: `${person.firstName} ${person.lastName}`,
                email: person.email,
                totalReadings: person._count.readings,
                readingStats: {
                    approved: person.readings.filter(r => r.status === 'APPROVED').length,
                    pending: person.readings.filter(r => r.status === 'PENDING').length,
                    rejected: person.readings.filter(r => r.status === 'REJECTED').length,
                },
            }));
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.AnalyticsService = AnalyticsService;
exports.default = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map