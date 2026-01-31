import { Request, Response } from 'express';
import staffService from './staff.service';
import { validateData, registerSchema } from '../../utils/validators';
import { CreateStaffInput } from './staff.types';

export class StaffController {
  async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      const staff = await staffService.getAllStaff(req.user.organizationId, skip, limit);
      const total = await staffService.countStaff(req.user.organizationId);

      res.status(200).json({
        data: {
          staff: staff.map(s => ({
            id: s.id,
            email: s.email,
            name: s.name,
            role: s.role,
            createdAt: s.createdAt
          })),
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async invite(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<CreateStaffInput>(registerSchema, req.body);
      const staff = await staffService.inviteStaff(
        req.user.organizationId,
        req.user.userId,
        input
      );
      res.status(201).json(staff);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getByRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { role } = req.params;
      const staff = await staffService.getStaffByRole(
        req.user.organizationId,
        role.toUpperCase()
      );
      res.status(200).json(staff);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const staff = await staffService.getStaffById(
        req.user.organizationId,
        req.params.id
      );
      res.status(200).json(staff);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { role } = req.body;
      const staff = await staffService.updateStaffRole(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        role
      );
      res.status(200).json(staff);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await staffService.deactivateStaff(
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

export default new StaffController();
