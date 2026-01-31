export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateInviteCode: () => string;
export declare const formatDate: (date: Date) => string;
export declare const getPaginationParams: (page: string | undefined, limit: string | undefined) => {
    skip: number;
    take: number;
};
//# sourceMappingURL=helpers.d.ts.map