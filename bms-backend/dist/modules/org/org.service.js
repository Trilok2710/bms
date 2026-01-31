"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
class OrgService {
    async getOrgDetails(orgId) {
        try {
            const org = await prisma_1.prisma.organization.findUnique({
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
                throw new errors_1.NotFoundError('Organization not found');
            }
            return org;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getOrgUsers(orgId) {
        try {
            const users = await prisma_1.prisma.user.findMany({
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async regenerateInviteCode(orgId, userId) {
        try {
            // Verify user is admin of this org
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError();
            }
            const updatedOrg = await prisma_1.prisma.organization.update({
                where: { id: orgId },
                data: { inviteCode: (0, helpers_1.generateInviteCode)() },
            });
            return updatedOrg;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async deactivateUser(orgId, userId, targetUserId) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError();
            }
            // Deactivate target user
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: targetUserId },
                data: { isActive: false },
            });
            return updatedUser;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.OrgService = OrgService;
exports.default = new OrgService();
//# sourceMappingURL=org.service.js.map