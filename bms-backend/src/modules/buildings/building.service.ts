import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError } from '../../utils/errors';
import { CreateBuildingInput, UpdateBuildingInput } from './building.types';
import { getPaginationParams } from '../../utils/helpers';

export class BuildingService {
  async createBuilding(orgId: string, userId: string, input: CreateBuildingInput) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can create buildings');
      }

      const building = await prisma.building.create({
        data: {
          ...input,
          organizationId: orgId,
        },
      });

      return building;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getBuildings(orgId: string, page?: string, limit?: string) {
    try {
      const { skip, take } = getPaginationParams(page, limit);

      const [buildings, total] = await Promise.all([
        prisma.building.findMany({
          where: { organizationId: orgId },
          include: {
            _count: {
              select: { categories: true, tasks: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.building.count({
          where: { organizationId: orgId },
        }),
      ]);

      return {
        buildings,
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

  async getBuildingById(orgId: string, buildingId: string) {
    try {
      const building = await prisma.building.findFirst({
        where: {
          id: buildingId,
          organizationId: orgId,
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              frequency: true,
            },
          },
        },
      });

      if (!building) {
        throw new NotFoundError('Building not found');
      }

      return building;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async updateBuilding(
    orgId: string,
    userId: string,
    buildingId: string,
    input: UpdateBuildingInput
  ) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can update buildings');
      }

      const building = await prisma.building.update({
        where: { id: buildingId },
        data: input,
      });

      return building;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async deleteBuilding(orgId: string, userId: string, buildingId: string) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can delete buildings');
      }

      // Verify building exists and belongs to organization
      const building = await prisma.building.findFirst({
        where: {
          id: buildingId,
          organizationId: orgId,
        },
      });

      if (!building) {
        throw new NotFoundError('Building not found');
      }

      await prisma.building.delete({
        where: { id: buildingId },
      });

      return { message: 'Building deleted successfully' };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export default new BuildingService();
