import { RegisterInput, LoginInput, AuthResponse } from './auth.types';
export declare class AuthService {
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    getMe(userId: string): Promise<{
        organization: {
            id: string;
            name: string;
            inviteCode: string;
        };
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        organizationId: string;
    }>;
    private generateInviteCode;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map