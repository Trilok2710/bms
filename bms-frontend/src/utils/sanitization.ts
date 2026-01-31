import DOMPurify from 'dompurify';

/**
 * Frontend input sanitization utilities to prevent XSS
 */

// Sanitize HTML content
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
};

// Sanitize plain text (removes all HTML tags)
export const sanitizePlainText = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// Sanitize user input for display
export const sanitizeUserInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return sanitizePlainText(input.trim());
};

// Validate and sanitize email
export const validateAndSanitizeEmail = (email: string): string | null => {
  const sanitized = sanitizePlainText(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
};

// Validate URL to prevent javascript: protocol
export const validateUrl = (url: string): boolean => {
  try {
    // Reject javascript: and data: protocols
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      return false;
    }

    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Escape special characters for display
export const escapeSpecialChars = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize object data (for localStorage, API responses)
export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      return sanitizeUserInput(obj);
    }
    return obj;
  }

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeUserInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};
