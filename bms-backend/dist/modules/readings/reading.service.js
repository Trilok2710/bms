"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
const notification_service_1 = __importDefault(require("../notifications/notification.service"));
class ReadingService {
    async submitReading(orgId, userId, input) {
        try {
            const task = await prisma_1.prisma.task.findFirst({
                where: {
                    id: input.taskId,
                    organizationId: orgId,
                },
                include: {
                    category: true,
                    building: true,
                },
            });
            if (!task) {
                throw new errors_1.NotFoundError('Task not found');
            }
            // Check if reading is within acceptable range
            if (task.category.minValue !== null && input.value < task.category.minValue) {
                return new errors_1.BadRequestError(`Value is below minimum (${task.category.minValue})`);
            }
            if (task.category.maxValue !== null && input.value > task.category.maxValue) {
                return new errors_1.BadRequestError(`Value is above maximum (${task.category.maxValue})`);
            }
            const reading = await prisma_1.prisma.reading.create({
                data: {
                    value: input.value,
                    notes: input.notes,
                    organizationId: orgId,
                    buildingId: task.buildingId,
                    categoryId: task.categoryId,
                    taskId: input.taskId,
                    submittedById: userId,
                    status: 'PENDING',
                },
                include: {
                    submittedBy: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                            unit: true,
                        },
                    },
                    task: {
                        select: {
                            title: true,
                        },
                    },
                },
            });
            // Get supervisors and admins to notify about new reading submission
            const supervisors = await prisma_1.prisma.user.findMany({
                where: {
                    organizationId: orgId,
                    role: { in: ['ADMIN', 'SUPERVISOR'] },
                },
                select: { id: true },
            });
            // Create notifications for supervisors/admins
            if (supervisors.length > 0) {
                await prisma_1.prisma.notification.createMany({
                    data: supervisors.map(supervisor => ({
                        type: 'READING_SUBMITTED',
                        title: 'New Reading Submitted',
                        message: `Reading submitted for ${task.title} by ${reading.submittedBy.firstName} ${reading.submittedBy.lastName}`,
                        userId: supervisor.id,
                        organizationId: orgId,
                        readingId: reading.id,
                    })),
                });
            }
            return reading;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getAllReadings(orgId, page, limit) {
        try {
            const { skip, take } = (0, helpers_1.getPaginationParams)(page, limit);
            const [readings, total] = await Promise.all([
                prisma_1.prisma.reading.findMany({
                    where: {
                        organizationId: orgId,
                    },
                    include: {
                        submittedBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                                unit: true,
                            },
                        },
                        building: {
                            select: {
                                name: true,
                            },
                        },
                        task: {
                            select: {
                                title: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take,
                }),
                prisma_1.prisma.reading.count({
                    where: {
                        organizationId: orgId,
                    },
                }),
            ]);
            return {
                data: {
                    readings,
                    pagination: {
                        total,
                        pages: Math.ceil(total / take),
                        skip,
                        take,
                    },
                },
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getPendingReadings(orgId, page, limit) {
        try {
            const { skip, take } = (0, helpers_1.getPaginationParams)(page, limit);
            const [readings, total] = await Promise.all([
                prisma_1.prisma.reading.findMany({
                    where: {
                        organizationId: orgId,
                        status: 'PENDING',
                    },
                    include: {
                        submittedBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                                unit: true,
                            },
                        },
                        building: {
                            select: {
                                name: true,
                            },
                        },
                        task: {
                            select: {
                                title: true,
                            },
                        },
                        comments: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy: { submittedAt: 'desc' },
                }),
                prisma_1.prisma.reading.count({
                    where: {
                        organizationId: orgId,
                        status: 'PENDING',
                    },
                }),
            ]);
            return {
                readings,
                pagination: {
                    total,
                    page: Math.ceil(skip / take) + 1,
                    limit: take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async approveReading(orgId, userId, readingId, comment) {
        try {
            // Verify user is admin or supervisor
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
                throw new errors_1.AuthorizationError('Only admins and supervisors can approve readings');
            }
            const reading = await prisma_1.prisma.reading.update({
                where: { id: readingId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                },
                include: {
                    comments: true,
                },
            });
            // Add comment if provided
            if (comment) {
                await prisma_1.prisma.readingComment.create({
                    data: {
                        comment,
                        organizationId: orgId,
                        readingId,
                        userId,
                    },
                });
            }
            // Create notification for the technician who submitted the reading
            await notification_service_1.default.createNotification({
                userId: reading.submittedById,
                organizationId: orgId,
                type: 'READING_APPROVED',
                title: 'Reading Approved',
                message: `Your submitted reading has been approved${comment ? ': ' + comment : ''}`,
                readingId,
                taskId: reading.taskId,
            });
            return reading;
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async rejectReading(orgId, userId, readingId, comment) {
        try {
            // Verify user is admin or supervisor
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
                throw new errors_1.AuthorizationError('Only admins and supervisors can reject readings');
            }
            const reading = await prisma_1.prisma.reading.update({
                where: { id: readingId },
                data: {
                    status: 'REJECTED',
                },
                include: {
                    comments: true,
                },
            });
            // Add comment if provided
            if (comment) {
                await prisma_1.prisma.readingComment.create({
                    data: {
                        comment,
                        organizationId: orgId,
                        readingId,
                        userId,
                    },
                });
            }
            // Create notification for the technician who submitted the reading
            await notification_service_1.default.createNotification({
                userId: reading.submittedById,
                organizationId: orgId,
                type: 'READING_REJECTED',
                title: 'Reading Rejected',
                message: `Your submitted reading has been rejected${comment ? ': ' + comment : ''}`,
                readingId,
                taskId: reading.taskId,
            });
            return reading;
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async addComment(orgId, userId, readingId, input) {
        try {
            // Get reading to find who submitted it
            const reading = await prisma_1.prisma.reading.findUnique({
                where: { id: readingId },
                select: { submittedById: true, taskId: true },
            });
            if (!reading) {
                throw new errors_1.NotFoundError('Reading not found');
            }
            const comment = await prisma_1.prisma.readingComment.create({
                data: {
                    comment: input.comment,
                    organizationId: orgId,
                    readingId,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            // Notify the technician who submitted the reading
            if (reading.submittedById !== userId) {
                await notification_service_1.default.createNotification({
                    userId: reading.submittedById,
                    organizationId: orgId,
                    type: 'TASK_COMMENTED',
                    title: 'New Comment on Your Reading',
                    message: `A new comment has been added to your reading submission: "${input.comment.substring(0, 50)}..."`,
                    readingId,
                    taskId: reading.taskId,
                });
            }
            return comment;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getReadingsByCategory(orgId, buildingId, categoryId, page, limit) {
        try {
            const { skip, take } = (0, helpers_1.getPaginationParams)(page, limit);
            const [readings, total] = await Promise.all([
                prisma_1.prisma.reading.findMany({
                    where: {
                        organizationId: orgId,
                        buildingId,
                        categoryId,
                        status: 'APPROVED',
                    },
                    include: {
                        submittedBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy: { submittedAt: 'desc' },
                }),
                prisma_1.prisma.reading.count({
                    where: {
                        organizationId: orgId,
                        buildingId,
                        categoryId,
                        status: 'APPROVED',
                    },
                }),
            ]);
            return {
                readings,
                pagination: {
                    total,
                    page: Math.ceil(skip / take) + 1,
                    limit: take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getUserReadingHistory(orgId, userId, page, limit) {
        try {
            const { skip, take } = (0, helpers_1.getPaginationParams)(page, limit);
            const [readings, total] = await Promise.all([
                prisma_1.prisma.reading.findMany({
                    where: {
                        organizationId: orgId,
                        submittedById: userId,
                    },
                    include: {
                        category: {
                            select: { name: true, unit: true },
                        },
                        building: {
                            select: { name: true },
                        },
                        task: {
                            select: { title: true },
                        },
                    },
                    skip,
                    take,
                    orderBy: { submittedAt: 'desc' },
                }),
                prisma_1.prisma.reading.count({
                    where: {
                        organizationId: orgId,
                        submittedById: userId,
                    },
                }),
            ]);
            return {
                readings,
                pagination: {
                    total,
                    page: Math.ceil(skip / take) + 1,
                    limit: take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.ReadingService = ReadingService;
exports.default = new ReadingService();
//# sourceMappingURL=reading.service.js.map