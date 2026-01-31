import { CreateCategoryInput, UpdateCategoryInput } from './category.types';
export declare class CategoryService {
    createCategory(orgId: string, userId: string, input: CreateCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        unit: string | null;
        minValue: number | null;
        maxValue: number | null;
        buildingId: string;
    }>;
    getCategoriesByBuilding(orgId: string, buildingId: string): Promise<({
        _count: {
            readings: number;
            tasks: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        unit: string | null;
        minValue: number | null;
        maxValue: number | null;
        buildingId: string;
    })[]>;
    updateCategory(orgId: string, userId: string, categoryId: string, input: UpdateCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        unit: string | null;
        minValue: number | null;
        maxValue: number | null;
        buildingId: string;
    }>;
    deleteCategory(orgId: string, userId: string, categoryId: string): Promise<{
        message: string;
    }>;
}
declare const _default: CategoryService;
export default _default;
//# sourceMappingURL=category.service.d.ts.map