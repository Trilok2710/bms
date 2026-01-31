// Auth types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN';
  organizationId: string;
}

export interface AuthContextType {
  user: User | null;
  organizationName: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN';
  inviteCode?: string;
}

// Building types
export interface Building {
  id: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  buildingId: string;
  createdAt: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
  scheduledTime: string;
  buildingId: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  assignments?: Array<{
    id: string;
    userId: string;
    taskId: string;
    createdAt: string;
  }>;
}

// Reading types
export interface Reading {
  id: string;
  value: number;
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  taskId: string;
  buildingId: string;
  categoryId: string;
  submittedById: string;
  submittedAt: string;
  approvedAt?: string;
}

export interface ReadingComment {
  id: string;
  comment: string;
  userId: string;
  readingId: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

// Stats types
export interface OrgStats {
  totalReadings: number;
  approvedReadings: number;
  pendingReadings: number;
  rejectedReadings: number;
  approvalRate: string;
  taskCount: number;
  buildingCount: number;
}

export interface CategoryStats {
  totalReadings: number;
  approvedReadings: number;
  pendingReadings: number;
  averageValue: number;
  recentReadings: any[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
