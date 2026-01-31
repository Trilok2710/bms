import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError, BadRequestError } from '../../utils/errors';
import { CreateReadingInput, UpdateReadingStatusInput, AddReadingCommentInput } from './reading.types';
import { getPaginationParams } from '../../utils/helpers';
import notificationService from '../notifications/notification.service';

export class ReadingService {
  async submitReading(orgId: string, userId: string, input: CreateReadingInput) {
    try {
      const task = await prisma.task.findFirst({
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
        throw new NotFoundError('Task not found');
      }

      // Check if reading is within acceptable range
      if (task.category.minValue !== null && input.value < task.category.minValue) {
        return new BadRequestError(
          `Value is below minimum (${task.category.minValue})`
        );
      }

      if (task.category.maxValue !== null && input.value > task.category.maxValue) {
        return new BadRequestError(
          `Value is above maximum (${task.category.maxValue})`
        );
      }

      const reading = await prisma.reading.create({
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
      const supervisors = await prisma.user.findMany({
        where: {
          organizationId: orgId,
          role: { in: ['ADMIN', 'SUPERVISOR'] },
        },
        select: { id: true },
      });

      // Create notifications for supervisors/admins
      if (supervisors.length > 0) {
        await prisma.notification.createMany({
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
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async getAllReadings(orgId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [readings, total] = await Promise.all([
        prisma.reading.findMany({
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
        prisma.reading.count({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getPendingReadings(orgId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [readings, total] = await Promise.all([
        prisma.reading.findMany({
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
        prisma.reading.count({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async approveReading(orgId: string, userId: string, readingId: string, comment?: string) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can approve readings');
      }

      const reading = await prisma.reading.update({
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
        await prisma.readingComment.create({
          data: {
            comment,
            organizationId: orgId,
            readingId,
            userId,
          },
        });
      }

      // Create notification for the technician who submitted the reading
      await notificationService.createNotification({
        userId: reading.submittedById,
        organizationId: orgId,
        type: 'READING_APPROVED',
        title: 'Reading Approved',
        message: `Your submitted reading has been approved${comment ? ': ' + comment : ''}`,
        readingId,
        taskId: reading.taskId,
      });

      return reading;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async rejectReading(orgId: string, userId: string, readingId: string, comment?: string) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can reject readings');
      }

      const reading = await prisma.reading.update({
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
        await prisma.readingComment.create({
          data: {
            comment,
            organizationId: orgId,
            readingId,
            userId,
          },
        });
      }

      // Create notification for the technician who submitted the reading
      await notificationService.createNotification({
        userId: reading.submittedById,
        organizationId: orgId,
        type: 'READING_REJECTED',
        title: 'Reading Rejected',
        message: `Your submitted reading has been rejected${comment ? ': ' + comment : ''}`,
        readingId,
        taskId: reading.taskId,
      });

      return reading;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async addComment(orgId: string, userId: string, readingId: string, input: AddReadingCommentInput) {
    try {
      // Get reading to find who submitted it
      const reading = await prisma.reading.findUnique({
        where: { id: readingId },
        select: { submittedById: true, taskId: true },
      });

      if (!reading) {
        throw new NotFoundError('Reading not found');
      }

      const comment = await prisma.readingComment.create({
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
        await notificationService.createNotification({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getReadingsByCategory(
    orgId: string,
    buildingId: string,
    categoryId: string,
    page?: string,
    limit?: string
  ) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [readings, total] = await Promise.all([
        prisma.reading.findMany({
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
        prisma.reading.count({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getUserReadingHistory(orgId: string, userId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [readings, total] = await Promise.all([
        prisma.reading.findMany({
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
        prisma.reading.count({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export default new ReadingService();
