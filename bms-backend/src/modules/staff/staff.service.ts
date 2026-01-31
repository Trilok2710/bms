import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError, ConflictError } from '../../utils/errors';
import { CreateStaffInput } from './staff.types';
import { hashPassword } from '../../utils/helpers';
import { UserRole } from '@prisma/client';

export class StaffService {
  async getAllStaff(orgId: string, skip: number, take: number) {
    try {
      const staff = await prisma.user.findMany({
        where: {
          organizationId: orgId,
          role: { in: ['SUPERVISOR', 'TECHNICIAN'] }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      });

      return staff.map(s => ({
        ...s,
        name: `${s.firstName} ${s.lastName}`.trim()
      }));
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async countStaff(orgId: string) {
    try {
      return await prisma.user.count({
        where: {
          organizationId: orgId,
          role: { in: ['SUPERVISOR', 'TECHNICIAN'] }
        }
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async inviteStaff(orgId: string, userId: string, input: CreateStaffInput) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can invite staff');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          organizationId: orgId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof AuthorizationError || error instanceof ConflictError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async getStaffByRole(orgId: string, role: string) {
    try {
      const staff = await prisma.user.findMany({
        where: {
          organizationId: orgId,
          role: role as UserRole,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              assignedTasks: true,
              readings: true,
            },
          },
        },
      });

      return staff;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getStaffById(orgId: string, staffId: string) {
    try {
      const staff = await prisma.user.findFirst({
        where: {
          id: staffId,
          organizationId: orgId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          assignedTasks: {
            include: {
              task: {
                select: {
                  title: true,
                  frequency: true,
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
            },
            take: 10,
            orderBy: { submittedAt: 'desc' },
          },
        },
      });

      if (!staff) {
        throw new NotFoundError('Staff not found');
      }

      return staff;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async updateStaffRole(orgId: string, userId: string, staffId: string, newRole: string) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can update staff roles');
      }

      const updatedStaff = await prisma.user.update({
        where: { id: staffId },
        data: { role: newRole as UserRole },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      return updatedStaff;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async deactivateStaff(orgId: string, userId: string, staffId: string) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can deactivate staff');
      }

      const updatedStaff = await prisma.user.update({
        where: { id: staffId },
        data: { isActive: false },
      });

      return { message: 'Staff deactivated successfully', staff: updatedStaff };
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }
}

export default new StaffService();
