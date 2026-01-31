import { Request, Response } from 'express';
import readingService from './reading.service';
import { validateData, createReadingSchema, updateReadingStatusSchema } from '../../utils/validators';
import { CreateReadingInput, UpdateReadingStatusInput, AddReadingCommentInput } from './reading.types';

export class ReadingController {
  async submit(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<CreateReadingInput>(createReadingSchema, req.body);
      const reading = await readingService.submitReading(
        req.user.organizationId,
        req.user.userId,
        input
      );
      res.status(201).json(reading);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit } = req.query;
      const result = await readingService.getPendingReadings(
        req.user.organizationId,
        page as string,
        limit as string
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit } = req.query;
      const result = await readingService.getAllReadings(
        req.user.organizationId,
        page as string,
        limit as string
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { comment } = req.body;
      const reading = await readingService.approveReading(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        comment
      );
      res.status(200).json(reading);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { comment } = req.body;
      const reading = await readingService.rejectReading(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        comment
      );
      res.status(200).json(reading);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = req.body as AddReadingCommentInput;
      const comment = await readingService.addComment(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        input
      );
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { buildingId, categoryId } = req.params;
      const { page, limit } = req.query;
      const result = await readingService.getReadingsByCategory(
        req.user.organizationId,
        buildingId,
        categoryId,
        page as string,
        limit as string
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getMyHistory(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit } = req.query;
      const result = await readingService.getUserReadingHistory(
        req.user.organizationId,
        req.user.userId,
        page as string,
        limit as string
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new ReadingController();
