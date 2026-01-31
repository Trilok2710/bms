export interface CreateStaffInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'SUPERVISOR' | 'TECHNICIAN';
}
export interface StaffResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
}
//# sourceMappingURL=staff.types.d.ts.map