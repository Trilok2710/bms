/**
 * Utility functions for frontend
 */

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime with time
 */
export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format number to percentage
 */
export const formatPercentage = (value: number, decimals = 1) => {
  return (value).toFixed(decimals) + '%';
};

/**
 * Get user initials
 */
export const getInitials = (firstName: string, lastName: string) => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

/**
 * Check if value is within range
 */
export const isWithinRange = (value: number, min?: number, max?: number) => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    PENDING: 'yellow',
    APPROVED: 'green',
    REJECTED: 'red',
    ACTIVE: 'green',
    INACTIVE: 'gray',
    ADMIN: 'blue',
    SUPERVISOR: 'purple',
    TECHNICIAN: 'cyan',
  };
  return colorMap[status] || 'gray';
};

/**
 * Local storage utilities
 */
export const storage = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

/**
 * Delay utility for async operations
 */
export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
