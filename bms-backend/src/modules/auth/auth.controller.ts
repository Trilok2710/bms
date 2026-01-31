import { Request, Response } from 'express';
import authService from './auth.service';
import { validateData, registerSchema, loginSchema } from '../../utils/validators';
import { RegisterInput, LoginInput } from './auth.types';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const input = validateData<RegisterInput>(registerSchema, req.body);
      const result = await authService.register(input);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const input = validateData<LoginInput>(loginSchema, req.body);
      const result = await authService.login(input);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await authService.getMe(req.user.userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

export default new AuthController();
