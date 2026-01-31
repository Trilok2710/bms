import { Request, Response } from 'express';
import notificationService from './notification.service';

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const result = await notificationService.getUserNotifications(req.user.userId, skip, limit);
      res.status(200).json({
        data: {
          notifications: result.notifications,
          pagination: result.pagination,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const count = await notificationService.getUnreadCount(req.user.userId);
      res.status(200).json({ data: { unreadCount: count } });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const notification = await notificationService.markAsRead(req.user.userId, id);
      res.status(200).json({ data: notification });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await notificationService.markAllAsRead(req.user.userId);
      res.status(200).json({ data: { message: 'All notifications marked as read' } });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      await notificationService.deleteNotification(req.user.userId, id);
      res.status(200).json({ data: { message: 'Notification deleted' } });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new NotificationController();
