import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging (but only in development)
  if (env.NODE_ENV === 'development') {
    console.error('[ERROR]', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    // In production, log minimal info to prevent data leakage
    console.error('[ERROR]', {
      message: err.message,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Handle validation errors
  if (err.message.includes('ValidationError')) {
    return res.status(400).json({
      error: 'Validation failed',
      statusCode: 400,
    });
  }

  // Handle JWT errors
  if (err.message.includes('Invalid') || err.message.includes('expired')) {
    return res.status(401).json({
      error: 'Unauthorized',
      statusCode: 401,
    });
  }

  // Prevent leaking stack traces and sensitive error details in production
  const errorResponse =
    env.NODE_ENV === 'development'
      ? {
          error: err.message || 'Internal server error',
          statusCode: 500,
          stack: err.stack,
        }
      : {
          error: 'Internal server error',
          statusCode: 500,
        };

  return res.status(500).json(errorResponse);
};
