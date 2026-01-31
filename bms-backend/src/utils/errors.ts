export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export const handlePrismaError = (error: any): AppError => {
  // If it's already an AppError (including AuthorizationError, NotFoundError, etc.), pass it through
  if (error instanceof AppError) {
    return error;
  }

  console.error('Prisma Error:', error);
  
  if (error.code === 'P2002') {
    return new ConflictError(`${error.meta?.target?.[0] || 'Field'} already exists`);
  }
  if (error.code === 'P2025') {
    return new NotFoundError('Resource not found');
  }
  if (error.code === 'P2003') {
    return new AppError(400, `Foreign key constraint failed: ${error.meta?.field_name || 'unknown'}`);
  }
  
  console.error('Unknown Prisma error code:', error.code, error.message);
  return new AppError(500, `Database error: ${error.message || 'occurred'}`);
};
