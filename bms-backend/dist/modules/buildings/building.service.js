"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
class BuildingService {
    async createBuilding(orgId, userId, input) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can create buildings');
            }
            const building = await prisma_1.prisma.building.create({
                data: {
                    ...input,
                    organizationId: orgId,
                },
            });
            return building;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getBuildings(orgId, page, limit) {
        try {
            const { skip, take } = (0, helpers_1.getPaginationParams)(page, limit);
            const [buildings, total] = await Promise.all([
                prisma_1.prisma.building.findMany({
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
                prisma_1.prisma.building.count({
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getBuildingById(orgId, buildingId) {
        try {
            const building = await prisma_1.prisma.building.findFirst({
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
                throw new errors_1.NotFoundError('Building not found');
            }
            return building;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async updateBuilding(orgId, userId, buildingId, input) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can update buildings');
            }
            const building = await prisma_1.prisma.building.update({
                where: { id: buildingId },
                data: input,
            });
            return building;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async deleteBuilding(orgId, userId, buildingId) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can delete buildings');
            }
            // Verify building exists and belongs to organization
            const building = await prisma_1.prisma.building.findFirst({
                where: {
                    id: buildingId,
                    organizationId: orgId,
                },
            });
            if (!building) {
                throw new errors_1.NotFoundError('Building not found');
            }
            await prisma_1.prisma.building.delete({
                where: { id: buildingId },
            });
            return { message: 'Building deleted successfully' };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.BuildingService = BuildingService;
exports.default = new BuildingService();
//# sourceMappingURL=building.service.js.map