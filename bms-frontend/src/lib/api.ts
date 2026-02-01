import axios, { AxiosInstance } from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // Check if environment variable is set (from Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL as string;
  }
  
  // Runtime detection: check if running on localhost or production
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  // Production fallback - hardcoded backend URL
  return 'https://bms-production-e556.up.railway.app';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  register(data: any) {
    return this.api.post('/auth/register', data);
  }

  login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password });
  }

  getMe() {
    return this.api.get('/auth/me');
  }

  // Building endpoints
  getBuildings(page?: number, limit?: number) {
    return this.api.get('/buildings', { params: { page, limit } });
  }

  getBuildingById(id: string) {
    return this.api.get(`/buildings/${id}`);
  }

  createBuilding(data: any) {
    return this.api.post('/buildings', data);
  }

  updateBuilding(id: string, data: any) {
    return this.api.patch(`/buildings/${id}`, data);
  }

  deleteBuilding(id: string) {
    return this.api.delete(`/buildings/${id}`);
  }

  // Category endpoints
  getCategoriesByBuilding(buildingId: string) {
    return this.api.get(`/categories/buildings/${buildingId}/categories`);
  }

  createCategory(buildingId: string, data: any) {
    return this.api.post(`/categories/buildings/${buildingId}/categories`, data);
  }

  updateCategory(buildingId: string, categoryId: string, data: any) {
    return this.api.patch(`/categories/${categoryId}`, data);
  }

  deleteCategory(buildingId: string, categoryId: string) {
    return this.api.delete(`/categories/${categoryId}`);
  }

  // Task endpoints
  getTasks(page?: number, limit?: number) {
    return this.api.get('/tasks', { params: { page, limit } });
  }

  getMyTasks(page?: number, limit?: number) {
    return this.api.get('/tasks/my-tasks', { params: { page, limit } });
  }

  getAvailableTasksForReading() {
    return this.api.get('/tasks/available-for-reading');
  }

  getTaskById(id: string) {
    return this.api.get(`/tasks/${id}`);
  }

  createTask(data: any) {
    return this.api.post('/tasks', data);
  }

  updateTask(id: string, data: any) {
    return this.api.patch(`/tasks/${id}`, data);
  }

  deleteTask(id: string) {
    return this.api.delete(`/tasks/${id}`);
  }

  assignTaskToStaff(taskId: string, staffIds: string[]) {
    return this.api.post(`/tasks/${taskId}/assignments`, { staffIds });
  }

  getTaskAssignments(taskId: string) {
    return this.api.get(`/tasks/${taskId}/assignments`);
  }

  assignTask(id: string, userIds: string[]) {
    return this.api.post(`/tasks/${id}/assign`, { assignedUserIds: userIds });
  }

  // Reading endpoints
  submitReading(data: any) {
    return this.api.post('/readings', data);
  }

  getReadings(page?: number, limit?: number) {
    return this.api.get('/readings', { params: { page, limit } });
  }

  getPendingReadings(page?: number, limit?: number) {
    return this.api.get('/readings/pending', { params: { page, limit } });
  }

  getMyReadingHistory(page?: number, limit?: number) {
    return this.api.get('/readings/my-history', { params: { page, limit } });
  }

  getReadingsByCategory(buildingId: string, categoryId: string, page?: number, limit?: number) {
    return this.api.get(`/readings/category/${buildingId}/${categoryId}`, { 
      params: { page, limit } 
    });
  }

  approveReading(id: string, comment?: string) {
    return this.api.post(`/readings/${id}/approve`, { comment });
  }

  rejectReading(id: string, comment?: string) {
    return this.api.post(`/readings/${id}/reject`, { comment });
  }

  addReadingComment(readingId: string, comment: string) {
    return this.api.post(`/readings/${readingId}/comments`, { comment });
  }

  // Staff endpoints
  inviteStaff(data: any) {
    return this.api.post('/staff/invite', data);
  }

  getStaffByRole(role: string) {
    return this.api.get(`/staff/role/${role}`);
  }

  getStaffById(id: string) {
    return this.api.get(`/staff/${id}`);
  }

  updateStaffRole(id: string, role: string) {
    return this.api.patch(`/staff/${id}/role`, { role });
  }

  deactivateStaff(id: string) {
    return this.api.delete(`/staff/${id}`);
  }

  // Analytics endpoints
  getOrgStats() {
    return this.api.get('/analytics/org/stats');
  }

  getCategoryStats(categoryId: string) {
    return this.api.get(`/analytics/category/${categoryId}`);
  }

  getBuildingStats(buildingId: string) {
    return this.api.get(`/analytics/building/${buildingId}`);
  }

  getReadingTrend(categoryId: string, days?: number) {
    return this.api.get(`/analytics/trend/${categoryId}`, { params: { days } });
  }

  getStaffPerformance() {
    return this.api.get('/analytics/staff/performance');
  }

  // Organization endpoints
  getOrgDetails() {
    return this.api.get('/org');
  }

  getOrgUsers() {
    return this.api.get('/org/users');
  }

  regenerateInviteCode() {
    return this.api.post('/org/invite-code', {});
  }

  // Staff management endpoints
  getStaff(page?: number, limit?: number) {
    return this.api.get('/staff', { params: { page, limit } });
  }

  getOrgInviteCode() {
    return this.api.get('/org/invite-code');
  }

  sendStaffInvitation(data: { email: string; role: 'SUPERVISOR' | 'TECHNICIAN' }) {
    return this.api.post('/staff/invite', data);
  }

  removeStaff(staffId: string) {
    return this.api.delete(`/staff/${staffId}`);
  }

  // Notification endpoints
  getNotifications(page?: number, limit?: number) {
    return this.api.get('/notifications', { params: { page, limit } });
  }

  getUnreadNotificationCount() {
    return this.api.get('/notifications/unread-count');
  }

  markNotificationAsRead(notificationId: string) {
    return this.api.put(`/notifications/${notificationId}/read`, {});
  }

  markAllNotificationsAsRead() {
    return this.api.put('/notifications/read-all', {});
  }

  deleteNotification(notificationId: string) {
    return this.api.delete(`/notifications/${notificationId}`);
  }
}

export default new ApiService();
