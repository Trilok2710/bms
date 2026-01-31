// This file is for Vite dev proxy configuration
// Ensures API requests are forwarded to backend during development

export const apiProxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path: string) => path,
  },
};

export const apiBaseUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export default {
  apiBaseUrl,
  apiProxy,
};
