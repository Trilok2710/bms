import * as z from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["ADMIN", "SUPERVISOR", "TECHNICIAN"]>;
    organizationId: z.ZodOptional<z.ZodString>;
    inviteCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "SUPERVISOR" | "TECHNICIAN";
    organizationId?: string | undefined;
    inviteCode?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "SUPERVISOR" | "TECHNICIAN";
    organizationId?: string | undefined;
    inviteCode?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createOrgSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const createBuildingSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    location?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    location?: string | undefined;
}>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    minValue: z.ZodOptional<z.ZodNumber>;
    maxValue: z.ZodOptional<z.ZodNumber>;
    buildingId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    buildingId: string;
    description?: string | undefined;
    unit?: string | undefined;
    minValue?: number | undefined;
    maxValue?: number | undefined;
}, {
    name: string;
    buildingId: string;
    description?: string | undefined;
    unit?: string | undefined;
    minValue?: number | undefined;
    maxValue?: number | undefined;
}>;
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    frequency: z.ZodEnum<["DAILY", "WEEKLY", "MONTHLY", "ONE_TIME"]>;
    scheduledTime: z.ZodString;
    buildingId: z.ZodString;
    categoryId: z.ZodString;
    assignedUserIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    buildingId: string;
    title: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ONE_TIME";
    scheduledTime: string;
    categoryId: string;
    description?: string | undefined;
    assignedUserIds?: string[] | undefined;
}, {
    buildingId: string;
    title: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ONE_TIME";
    scheduledTime: string;
    categoryId: string;
    description?: string | undefined;
    assignedUserIds?: string[] | undefined;
}>;
export declare const createReadingSchema: z.ZodObject<{
    value: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    taskId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: number;
    taskId: string;
    notes?: string | undefined;
}, {
    value: number;
    taskId: string;
    notes?: string | undefined;
}>;
export declare const updateReadingStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["APPROVED", "REJECTED"]>;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "APPROVED" | "REJECTED";
    comment?: string | undefined;
}, {
    status: "APPROVED" | "REJECTED";
    comment?: string | undefined;
}>;
export declare const validateData: <T>(schema: z.ZodSchema, data: unknown) => T;
//# sourceMappingURL=validators.d.ts.map