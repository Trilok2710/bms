import { prisma } from '../../config/prisma';
import { handlePrismaError, NotFoundError, AuthorizationError, ConflictError } from '../../utils/errors';
import { CreateCategoryInput, UpdateCategoryInput } from './category.types';

export class CategoryService {
  async createCategory(orgId: string, userId: string, input: CreateCategoryInput) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can create categories');
      }

      // Check if category with same name already exists for this building
      const existing = await prisma.category.findFirst({
        where: {
          buildingId: input.buildingId,
          organizationId: orgId,
          name: input.name,
        },
      });

      if (existing) {
        throw new ConflictError('Category with this name already exists for this building');
      }

      const category = await prisma.category.create({
        data: {
          ...input,
          organizationId: orgId,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof AuthorizationError || error instanceof ConflictError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async getCategoriesByBuilding(orgId: string, buildingId: string) {
    try {
      const categories = await prisma.category.findMany({
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
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async updateCategory(
    orgId: string,
    userId: string,
    categoryId: string,
    input: UpdateCategoryInput
  ) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can update categories');
      }

      const category = await prisma.category.update({
        where: { id: categoryId },
        data: input,
      });

      return category;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async deleteCategory(orgId: string, userId: string, categoryId: string) {
    try {
      // Verify user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.organizationId !== orgId || user.role !== 'ADMIN') {
        throw new AuthorizationError('Only admins can delete categories');
      }

      // Verify category exists and belongs to organization
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          organizationId: orgId,
        },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      // Delete tasks in this category first (cascade)
      await prisma.task.deleteMany({
        where: { categoryId },
      });

      // Delete the category
      await prisma.category.delete({
        where: { id: categoryId },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error instanceof AuthorizationError || error instanceof NotFoundError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }
}

export default new CategoryService();
