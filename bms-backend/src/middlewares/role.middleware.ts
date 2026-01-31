import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errors';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }

    next();
  };
};

// Helper middleware for specific role checks
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Only admins can perform this action' 
    });
  }
  next();
};

export const isSupervisorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !['ADMIN', 'SUPERVISOR'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Only supervisors and admins can perform this action' 
    });
  }
  next();
};
