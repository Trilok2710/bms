"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
class StaffService {
    async getAllStaff(orgId, skip, take) {
        try {
            const staff = await prisma_1.prisma.user.findMany({
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async countStaff(orgId) {
        try {
            return await prisma_1.prisma.user.count({
                where: {
                    organizationId: orgId,
                    role: { in: ['SUPERVISOR', 'TECHNICIAN'] }
                }
            });
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async inviteStaff(orgId, userId, input) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can invite staff');
            }
            // Check if user already exists
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email: input.email },
            });
            if (existingUser) {
                throw new errors_1.ConflictError('Email already registered');
            }
            // Hash password
            const hashedPassword = await (0, helpers_1.hashPassword)(input.password);
            // Create user
            const newUser = await prisma_1.prisma.user.create({
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
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError || error instanceof errors_1.ConflictError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getStaffByRole(orgId, role) {
        try {
            const staff = await prisma_1.prisma.user.findMany({
                where: {
                    organizationId: orgId,
                    role: role,
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getStaffById(orgId, staffId) {
        try {
            const staff = await prisma_1.prisma.user.findFirst({
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
                throw new errors_1.NotFoundError('Staff not found');
            }
            return staff;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async updateStaffRole(orgId, userId, staffId, newRole) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can update staff roles');
            }
            const updatedStaff = await prisma_1.prisma.user.update({
                where: { id: staffId },
                data: { role: newRole },
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
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async deactivateStaff(orgId, userId, staffId) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can deactivate staff');
            }
            const updatedStaff = await prisma_1.prisma.user.update({
                where: { id: staffId },
                data: { isActive: false },
            });
            return { message: 'Staff deactivated successfully', staff: updatedStaff };
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.StaffService = StaffService;
exports.default = new StaffService();
//# sourceMappingURL=staff.service.js.map