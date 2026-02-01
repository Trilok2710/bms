// This file is for Vite dev proxy configuration
// Ensures API requests are forwarded to backend during development

export const apiProxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path: string) => path,
  },
};

// Production backend URL - hardcoded for Vercel deployment
const PRODUCTION_API_URL = 'https://bms-production-e556.up.railway.app';

// Determine if running in development
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Build API base URL
export const apiBaseUrl = isDevelopment
  ? 'http://localhost:5000/api'
  : `${PRODUCTION_API_URL}/api`;

export default {
  apiBaseUrl,
  apiProxy,
};
