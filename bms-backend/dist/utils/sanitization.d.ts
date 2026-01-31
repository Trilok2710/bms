/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */
export declare const sanitizeString: (input: string) => string;
export declare const sanitizeEmail: (email: string) => string;
export declare const validateNumericInput: (value: any, min?: number, max?: number) => number;
export declare const sanitizeId: (id: string) => string;
export declare const sanitizeObject: (obj: any) => any;
export declare const validatePaginationParams: (page?: any, limit?: any) => {
    page: number;
    limit: number;
};
//# sourceMappingURL=sanitization.d.ts.map