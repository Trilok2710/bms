import { CreateBuildingInput, UpdateBuildingInput } from './building.types';
export declare class BuildingService {
    createBuilding(orgId: string, userId: string, input: CreateBuildingInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        location: string | null;
    }>;
    getBuildings(orgId: string, page?: string, limit?: string): Promise<{
        buildings: ({
            _count: {
                categories: number;
                tasks: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            description: string | null;
            location: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getBuildingById(orgId: string, buildingId: string): Promise<{
        categories: {
            id: string;
            name: string;
            unit: string | null;
        }[];
        tasks: {
            id: string;
            title: string;
            frequency: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        location: string | null;
    }>;
    updateBuilding(orgId: string, userId: string, buildingId: string, input: UpdateBuildingInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        description: string | null;
        location: string | null;
    }>;
    deleteBuilding(orgId: string, userId: string, buildingId: string): Promise<{
        message: string;
    }>;
}
declare const _default: BuildingService;
export default _default;
//# sourceMappingURL=building.service.d.ts.map