import { Request, Response } from 'express';
import taskService from './task.service';
import { validateData, createTaskSchema } from '../../utils/validators';
import { CreateTaskInput, UpdateTaskInput } from './task.types';

export class TaskController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<CreateTaskInput>(createTaskSchema, req.body);
      const task = await taskService.createTask(
        req.user.organizationId,
        req.user.userId,
        input
      );
      res.status(201).json({ data: task });
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
      
      // If user is a technician, show only assigned tasks
      // If user is admin or supervisor, show all org tasks
      let result;
      if (req.user.role === 'TECHNICIAN') {
        result = await taskService.getTasksByUser(
          req.user.organizationId,
          req.user.userId,
          page as string,
          limit as string
        );
      } else {
        result = await taskService.getTasksByOrg(
          req.user.organizationId,
          page as string,
          limit as string
        );
      }
      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getMyTasks(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit } = req.query;
      const result = await taskService.getTasksByUser(
        req.user.organizationId,
        req.user.userId,
        page as string,
        limit as string
      );
      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const task = await taskService.getTaskById(
        req.user.organizationId,
        req.params.id
      );
      res.status(200).json(task);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const input = validateData<UpdateTaskInput>(createTaskSchema, req.body);
      const task = await taskService.updateTask(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        input
      );
      res.status(200).json(task);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async assignUsers(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { assignedUserIds } = req.body;
      const task = await taskService.assignTask(
        req.user.organizationId,
        req.user.userId,
        req.params.id,
        assignedUserIds
      );
      res.status(200).json(task);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getAvailableTasksForReading(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tasks = await taskService.getAvailableTasksForReading(
        req.user.organizationId,
        req.user.userId
      );
      res.status(200).json({ data: tasks });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await taskService.deleteTask(
        req.user.organizationId,
        req.user.userId,
        req.params.id
      );
      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new TaskController();
