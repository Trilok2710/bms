export declare class OrgService {
    getOrgDetails(orgId: string): Promise<{
        _count: {
            users: number;
            buildings: number;
            tasks: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        inviteCode: string;
    }>;
    getOrgUsers(orgId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    regenerateInviteCode(orgId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        inviteCode: string;
    }>;
    deactivateUser(orgId: string, userId: string, targetUserId: string): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
    }>;
}
declare const _default: OrgService;
export default _default;
//# sourceMappingURL=org.service.d.ts.map