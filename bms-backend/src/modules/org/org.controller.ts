import { Request, Response } from 'express';
import orgService from './org.service';

export class OrgController {
  async getDetails(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.getOrgDetails(req.user.organizationId);
      res.status(200).json(org);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const users = await orgService.getOrgUsers(req.user.organizationId);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getInviteCode(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.getOrgDetails(req.user.organizationId);
      res.status(200).json({ inviteCode: org.inviteCode });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async regenerateInviteCode(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.regenerateInviteCode(
        req.user.organizationId,
        req.user.userId
      );
      res.status(200).json(org);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async deactivateUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { userId } = req.params;
      const user = await orgService.deactivateUser(
        req.user.organizationId,
        req.user.userId,
        userId
      );
      res.status(200).json(user);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new OrgController();
