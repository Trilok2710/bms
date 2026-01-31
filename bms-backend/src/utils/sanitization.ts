/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// Sanitize string inputs to prevent XSS
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>\"']/g, (char) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return escapeMap[char];
    });
};

// Validate and sanitize email
export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeString(email).toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized;
};

// Validate numeric input within range
export const validateNumericInput = (
  value: any,
  min?: number,
  max?: number
): number => {
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

// Validate and sanitize URL/path parameters
export const sanitizeId = (id: string): string => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID');
  }

  // UUIDs and MongoDB ObjectIds should only contain alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
    throw new Error('Invalid ID format');
  }

  return id.trim();
};

// Sanitize object by applying sanitization to all string values
export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

// Validate pagination parameters
export const validatePaginationParams = (
  page?: any,
  limit?: any
): { page: number; limit: number } => {
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 10));

  return { page: pageNum, limit: limitNum };
};
