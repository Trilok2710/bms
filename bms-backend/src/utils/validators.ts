import * as z from 'zod';

// Auth Validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'SUPERVISOR', 'TECHNICIAN']),
  organizationId: z.string().optional(),
  inviteCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Organization Validators
export const createOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
});

// Building Validators
export const createBuildingSchema = z.object({
  name: z.string().min(1, 'Building name is required'),
  description: z.string().optional(),
  location: z.string().optional(),
});

// Category Validators
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  unit: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  buildingId: z.string().min(1, 'Building ID is required'),
});

// Task Validators
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME']),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
  buildingId: z.string().min(1, 'Building ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  assignedUserIds: z.array(z.string()).optional(),
});

// Reading Validators
export const createReadingSchema = z.object({
  value: z.number({ invalid_type_error: 'Value must be a number' }),
  notes: z.string().optional(),
  taskId: z.string().min(1, 'Task ID is required'),
});

export const updateReadingStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  comment: z.string().optional(),
});

// Validators utility
export const validateData = <T>(schema: z.ZodSchema, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(errors);
  }
  return result.data as T;
};
