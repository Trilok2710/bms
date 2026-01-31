export interface CreateCategoryInput {
    name: string;
    description?: string;
    unit?: string;
    minValue?: number;
    maxValue?: number;
    buildingId: string;
}
export interface UpdateCategoryInput {
    name?: string;
    description?: string;
    unit?: string;
    minValue?: number;
    maxValue?: number;
}
//# sourceMappingURL=category.types.d.ts.map