import { Request, Response } from 'express';
import categoryService from './category.service';
import { validateData, createCategorySchema } from '../../utils/validators';
import { CreateCategoryInput, UpdateCategoryInput } from './category.types';

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<CreateCategoryInput>(createCategorySchema, {
        ...req.body,
        buildingId: req.params.buildingId,
      });
      const category = await categoryService.createCategory(
        req.user.organizationId,
        req.user.userId,
        input
      );
      res.status(201).json(category);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getByBuilding(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const categories = await categoryService.getCategoriesByBuilding(
        req.user.organizationId,
        req.params.buildingId
      );
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<UpdateCategoryInput>(createCategorySchema, req.body);
      const category = await categoryService.updateCategory(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        input
      );
      res.status(200).json(category);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await categoryService.deleteCategory(
        req.user.organizationId,
        req.user.userId,
        req.params.id
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new CategoryController();
