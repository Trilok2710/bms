"use strict";
/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaginationParams = exports.sanitizeObject = exports.sanitizeId = exports.validateNumericInput = exports.sanitizeEmail = exports.sanitizeString = void 0;
// Sanitize string inputs to prevent XSS
const sanitizeString = (input) => {
    if (typeof input !== 'string') {
        return '';
    }
    return input
        .trim()
        .replace(/[<>\"']/g, (char) => {
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
        };
        return escapeMap[char];
    });
};
exports.sanitizeString = sanitizeString;
// Validate and sanitize email
const sanitizeEmail = (email) => {
    const sanitized = (0, exports.sanitizeString)(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
        throw new Error('Invalid email format');
    }
    return sanitized;
};
exports.sanitizeEmail = sanitizeEmail;
// Validate numeric input within range
const validateNumericInput = (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) {
        throw new Error('Invalid numeric value');
    }
    if (min !== undefined && num < min) {
        throw new Error(`Value must be at least ${min}`);
    }
    if (max !== undefined && num > max) {
        throw new Error(`Value must not exceed ${max}`);
    }
    return num;
};
exports.validateNumericInput = validateNumericInput;
// Validate and sanitize URL/path parameters
const sanitizeId = (id) => {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid ID');
    }
    // UUIDs and MongoDB ObjectIds should only contain alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
        throw new Error('Invalid ID format');
    }
    return id.trim();
};
exports.sanitizeId = sanitizeId;
// Sanitize object by applying sanitization to all string values
const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const sanitized = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                sanitized[key] = (0, exports.sanitizeString)(value);
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = (0, exports.sanitizeObject)(value);
            }
            else {
                sanitized[key] = value;
            }
        }
    }
    return sanitized;
};
exports.sanitizeObject = sanitizeObject;
// Validate pagination parameters
const validatePaginationParams = (page, limit) => {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    return { page: pageNum, limit: limitNum };
};
exports.validatePaginationParams = validatePaginationParams;
//# sourceMappingURL=sanitization.js.map