import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError } from '../../utils/errors';
import { CreateOrgInput, UpdateOrgInput } from './org.types';
import { generateInviteCode } from '../../utils/helpers';

export class OrgService {
  async getOrgDetails(orgId: string) {
    try {
      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
          _count: {
            select: {
              buildings: true,
              users: true,
              tasks: true,
            },
          },
        },
      });

      if (!org) {
        throw new NotFoundError('Organization not found');
      }

      return org;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getOrgUsers(orgId: string) {
    try {
      const users = await prisma.user.findMany({
        where: { organizationId: orgId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      return users;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async regenerateInviteCode(orgId: string, userId: string) {
    try {
      // Verify user is admin of this org
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError();
      }

      const updatedOrg = await prisma.organization.update({
        where: { id: orgId },
        data: { inviteCode: generateInviteCode() },
      });

      return updatedOrg;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async deactivateUser(orgId: string, userId: string, targetUserId: string) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError();
      }

      // Deactivate target user
      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { isActive: false },
      });

      return updatedUser;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export default new OrgService();
