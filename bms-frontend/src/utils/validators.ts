/**
 * Validation utilities for frontend
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationError | null => {
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { field: 'password', message: 'Password must contain uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { field: 'password', message: 'Password must contain lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { field: 'password', message: 'Password must contain number' };
  }
  return null;
};

/**
 * Validate numeric value within range
 */
export const validateRange = (
  value: number,
  min?: number,
  max?: number
): ValidationError | null => {
  if (min !== undefined && value < min) {
    return { field: 'value', message: `Value must be at least ${min}` };
  }
  if (max !== undefined && value > max) {
    return { field: 'value', message: `Value must be at most ${max}` };
  }
  return null;
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
};

/**
 * Validate form data
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationError | null>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const [field, rule] of Object.entries(rules)) {
    const error = rule(data[field]);
    if (error) errors.push(error);
  }

  return errors;
};
