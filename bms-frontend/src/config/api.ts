// This file is for Vite dev proxy configuration
// Ensures API requests are forwarded to backend during development

export const apiProxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path: string) => path,
  },
};

// Use production backend URL directly
const isDev = typeof import.meta !== 'undefined' && import.meta.env.DEV;
const backendUrl = isDev 
  ? 'http://localhost:5000'
  : 'https://bms-production-e556.up.railway.app';

export const apiBaseUrl = (import.meta.env.VITE_API_URL as string) || `${backendUrl}/api`;

export default {
  apiBaseUrl,
  apiProxy,
};
