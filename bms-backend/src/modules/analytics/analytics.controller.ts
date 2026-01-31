import { Request, Response } from 'express';
import analyticsService from './analytics.service';

export class AnalyticsController {
  async getOrgStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await analyticsService.getOrgStats(req.user.organizationId);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getCategoryStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await analyticsService.getCategoryStats(
        req.user.organizationId,
        req.params.categoryId
      );
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getBuildingStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await analyticsService.getBuildingStats(
        req.user.organizationId,
        req.params.buildingId
      );
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getReadingTrend(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { days } = req.query;
      const trend = await analyticsService.getReadingTrend(
        req.user.organizationId,
        req.params.categoryId,
        days ? parseInt(days as string) : 30
      );
      res.status(200).json(trend);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getStaffPerformance(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const performance = await analyticsService.getStaffPerformance(
        req.user.organizationId
      );
      res.status(200).json(performance);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new AnalyticsController();
