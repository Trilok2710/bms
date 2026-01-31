"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.updateReadingStatusSchema = exports.createReadingSchema = exports.createTaskSchema = exports.createCategorySchema = exports.createBuildingSchema = exports.createOrgSchema = exports.loginSchema = exports.registerSchema = void 0;
const z = __importStar(require("zod"));
// Auth Validators
exports.registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['ADMIN', 'SUPERVISOR', 'TECHNICIAN']),
    organizationId: z.string().optional(),
    inviteCode: z.string().optional(),
});
exports.loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
// Organization Validators
exports.createOrgSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    description: z.string().optional(),
});
// Building Validators
exports.createBuildingSchema = z.object({
    name: z.string().min(1, 'Building name is required'),
    description: z.string().optional(),
    location: z.string().optional(),
});
// Category Validators
exports.createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
    unit: z.string().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    buildingId: z.string().min(1, 'Building ID is required'),
});
// Task Validators
exports.createTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME']),
    scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
    buildingId: z.string().min(1, 'Building ID is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    assignedUserIds: z.array(z.string()).optional(),
});
// Reading Validators
exports.createReadingSchema = z.object({
    value: z.number({ invalid_type_error: 'Value must be a number' }),
    notes: z.string().optional(),
    taskId: z.string().min(1, 'Task ID is required'),
});
exports.updateReadingStatusSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    comment: z.string().optional(),
});
// Validators utility
const validateData = (schema, data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(errors);
    }
    return result.data;
};
exports.validateData = validateData;
//# sourceMappingURL=validators.js.map