import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError } from '../../utils/errors';
import { CreateTaskInput, UpdateTaskInput } from './task.types';
import { getPaginationParams } from '../../utils/helpers';

export class TaskService {
  async createTask(orgId: string, userId: string, input: CreateTaskInput) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can create tasks');
      }

      // Verify the building and category exist in the org
      const [building, category] = await Promise.all([
        prisma.building.findFirst({
          where: { id: input.buildingId, organizationId: orgId },
        }),
        prisma.category.findFirst({
          where: { id: input.categoryId, organizationId: orgId },
        }),
      ]);

      if (!building || !category) {
        throw new NotFoundError('Building or category not found in this organization');
      }

      // Verify category belongs to the building
      if (category.buildingId !== building.id) {
        throw new AuthorizationError('Category does not belong to the selected building');
      }

      // Verify assigned users are technicians in the org
      if (input.assignedUserIds && input.assignedUserIds.length > 0) {
        const assignedUsers = await prisma.user.findMany({
          where: {
            id: { in: input.assignedUserIds },
            organizationId: orgId,
            role: 'TECHNICIAN',
          },
        });

        if (assignedUsers.length !== input.assignedUserIds.length) {
          throw new AuthorizationError('Some assigned users are not technicians in this organization');
        }
      }

      const task = await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          frequency: input.frequency,
          scheduledTime: input.scheduledTime,
          organizationId: orgId,
          buildingId: input.buildingId,
          categoryId: input.categoryId,
          assignments: {
            create: input.assignedUserIds?.map(userId => ({
              userId,
            })) || [],
          },
        },
        include: {
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      // Create notifications for assigned technicians
      if (input.assignedUserIds && input.assignedUserIds.length > 0) {
        await prisma.notification.createMany({
          data: input.assignedUserIds.map(userId => ({
            type: 'TASK_ASSIGNED',
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${task.title}`,
            userId,
            organizationId: orgId,
            taskId: task.id,
          })),
        });
      }

      return task;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async getTasksByOrg(orgId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where: { organizationId: orgId },
          include: {
            building: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
            assignments: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            _count: {
              select: { readings: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({
          where: { organizationId: orgId },
        }),
      ]);

      return {
        tasks,
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

  async getTasksByUser(orgId: string, userId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where: {
            organizationId: orgId,
            assignments: {
              some: {
                userId,
              },
            },
          },
          include: {
            building: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true, unit: true },
            },
            assignments: {
              select: {
                userId: true,
              },
            },
          },
          skip,
          take,
          orderBy: { scheduledTime: 'asc' },
        }),
        prisma.task.count({
          where: {
            organizationId: orgId,
            assignments: {
              some: {
                userId,
              },
            },
          },
        }),
      ]);

      return {
        tasks,
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

  async getAvailableTasksForReading(orgId: string, userId: string) {
    try {
      // Get current time
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      // Get tasks assigned to this user
      const tasks = await prisma.task.findMany({
        where: {
          organizationId: orgId,
          isActive: true,
          assignments: {
            some: {
              userId,
            },
          },
        },
        include: {
          building: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true, unit: true },
          },
        },
      });

      // Filter tasks based on current time
      // Task is available if: currentTime >= scheduledTime AND currentTime <= scheduledTime + 10 minutes
      const availableTasks = tasks.filter(task => {
        const [schedHours, schedMinutes] = task.scheduledTime.split(':').map(Number);
        const scheduledTimeInMinutes = schedHours * 60 + schedMinutes;
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Task is available for 10 minutes from scheduled time
        const isAvailable = 
          currentTimeInMinutes >= scheduledTimeInMinutes && 
          currentTimeInMinutes < scheduledTimeInMinutes + 10;
        
        return isAvailable;
      });

      return availableTasks;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getTaskById(orgId: string, taskId: string) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          organizationId: orgId,
        },
        include: {
          building: true,
          category: true,
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
          },
          readings: {
            select: {
              id: true,
              value: true,
              status: true,
              submittedAt: true,
              submittedBy: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: { submittedAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      return task;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async updateTask(
    orgId: string,
    userId: string,
    taskId: string,
    input: UpdateTaskInput
  ) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can update tasks');
      }

      // Build update data, handling relations properly
      const updateData: any = {
        title: input.title,
        description: input.description,
        frequency: input.frequency,
        scheduledTime: input.scheduledTime,
        isActive: input.isActive,
      };

      // Add relations if provided
      if (input.buildingId) {
        updateData.building = { connect: { id: input.buildingId } };
      }
      if (input.categoryId) {
        updateData.category = { connect: { id: input.categoryId } };
      }

      // Remove undefined values
      Object.keys(updateData).forEach(
        key => updateData[key] === undefined && delete updateData[key]
      );

      const task = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
      });

      // Handle assignedUserIds if provided
      if (input.assignedUserIds) {
        // Delete existing assignments
        await prisma.taskAssignment.deleteMany({
          where: { taskId },
        });

        // Create new assignments
        await prisma.taskAssignment.createMany({
          data: input.assignedUserIds.map(uid => ({
            taskId,
            userId: uid,
          })),
        });
      }

      return task;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async assignTask(orgId: string, userId: string, taskId: string, assignedUserIds: string[]) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can assign tasks');
      }

      // Verify the task exists in this organization
      const task = await prisma.task.findFirst({
        where: { id: taskId, organizationId: orgId },
      });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Verify all assigned users are technicians in this organization
      const assignedUsers = await prisma.user.findMany({
        where: {
          id: { in: assignedUserIds },
          organizationId: orgId,
          role: 'TECHNICIAN',
        },
      });

      if (assignedUsers.length !== assignedUserIds.length) {
        throw new AuthorizationError('Some assigned users are not technicians in this organization');
      }

      // Delete existing assignments
      await prisma.taskAssignment.deleteMany({
        where: { taskId },
      });

      // Create new assignments
      await prisma.taskAssignment.createMany({
        data: assignedUserIds.map(userId => ({
          taskId,
          userId,
        })),
      });

      const updatedTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return updatedTask;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async deleteTask(orgId: string, userId: string, taskId: string) {
    try {
      // Verify user is admin or supervisor
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || !['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new AuthorizationError('Only admins and supervisors can delete tasks');
      }

      // Verify task exists and belongs to org
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          organizationId: orgId,
        },
      });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Delete task assignments first (cascade)
      await prisma.taskAssignment.deleteMany({
        where: { taskId },
      });

      // Delete readings associated with this task
      await prisma.reading.deleteMany({
        where: { taskId },
      });

      // Delete notifications related to this task
      await prisma.notification.deleteMany({
        where: { taskId },
      });

      // Delete the task
      const deletedTask = await prisma.task.delete({
        where: { id: taskId },
      });

      return { message: 'Task deleted successfully', task: deletedTask };
    } catch (error) {
      if (error instanceof AuthorizationError || error instanceof NotFoundError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }
}

export default new TaskService();
