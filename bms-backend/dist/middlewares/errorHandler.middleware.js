"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    // Log error for debugging (but only in development)
    if (env_1.env.NODE_ENV === 'development') {
        console.error('[ERROR]', {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });
    }
    else {
        // In production, log minimal info to prevent data leakage
        console.error('[ERROR]', {
            message: err.message,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    }
    if (err instanceof errors_1.AppError) {
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
    const errorResponse = env_1.env.NODE_ENV === 'development'
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
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map