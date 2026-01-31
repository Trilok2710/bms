"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = exports.BadRequestError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(400, message);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(401, message);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'You do not have permission to perform this action') {
        super(403, message);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class BadRequestError extends AppError {
    constructor(message) {
        super(400, message);
    }
}
exports.BadRequestError = BadRequestError;
const handlePrismaError = (error) => {
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
exports.handlePrismaError = handlePrismaError;
//# sourceMappingURL=errors.js.map