"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
class CategoryService {
    async createCategory(orgId, userId, input) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can create categories');
            }
            // Check if category with same name already exists for this building
            const existing = await prisma_1.prisma.category.findFirst({
                where: {
                    buildingId: input.buildingId,
                    organizationId: orgId,
                    name: input.name,
                },
            });
            if (existing) {
                throw new errors_1.ConflictError('Category with this name already exists for this building');
            }
            const category = await prisma_1.prisma.category.create({
                data: {
                    ...input,
                    organizationId: orgId,
                },
            });
            return category;
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError || error instanceof errors_1.ConflictError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getCategoriesByBuilding(orgId, buildingId) {
        try {
            const categories = await prisma_1.prisma.category.findMany({
                where: {
                    organizationId: orgId,
                    buildingId,
                },
                include: {
                    _count: {
                        select: { tasks: true, readings: true },
                    },
                },
            });
            return categories;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async updateCategory(orgId, userId, categoryId, input) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can update categories');
            }
            const category = await prisma_1.prisma.category.update({
                where: { id: categoryId },
                data: input,
            });
            return category;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async deleteCategory(orgId, userId, categoryId) {
        try {
            // Verify user is admin
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
                throw new errors_1.AuthorizationError('Only admins can delete categories');
            }
            // Verify category exists and belongs to organization
            const category = await prisma_1.prisma.category.findFirst({
                where: {
                    id: categoryId,
                    organizationId: orgId,
                },
            });
            if (!category) {
                throw new errors_1.NotFoundError('Category not found');
            }
            // Delete tasks in this category first (cascade)
            await prisma_1.prisma.task.deleteMany({
                where: { categoryId },
            });
            // Delete the category
            await prisma_1.prisma.category.delete({
                where: { id: categoryId },
            });
            return { message: 'Category deleted successfully' };
        }
        catch (error) {
            if (error instanceof errors_1.AuthorizationError || error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
}
exports.CategoryService = CategoryService;
exports.default = new CategoryService();
//# sourceMappingURL=category.service.js.map