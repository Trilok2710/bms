import { Request, Response } from 'express';
import buildingService from './building.service';
import { validateData, createBuildingSchema } from '../../utils/validators';
import { CreateBuildingInput, UpdateBuildingInput } from './building.types';

export class BuildingController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<CreateBuildingInput>(createBuildingSchema, req.body);
      console.log('Creating building with input:', input, 'for org:', req.user.organizationId);
      const building = await buildingService.createBuilding(
        req.user.organizationId,
        req.user.userId,
        input
      );
      res.status(201).json({ data: building });
    } catch (error: any) {
      console.error('Building create error:', error);
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit } = req.query;
      const result = await buildingService.getBuildings(
        req.user.organizationId,
        page as string,
        limit as string
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const building = await buildingService.getBuildingById(
        req.user.organizationId,
        req.params.id
      );
      res.status(200).json(building);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<UpdateBuildingInput>(createBuildingSchema, req.body);
      const building = await buildingService.updateBuilding(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        input
      );
      res.status(200).json(building);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await buildingService.deleteBuilding(
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

export default new BuildingController();
