export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
    role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN';
    inviteCode?: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        organizationId: string;
    };
    organizationName?: string;
}
//# sourceMappingURL=auth.types.d.ts.map