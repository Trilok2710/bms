"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingController = void 0;
const building_service_1 = __importDefault(require("./building.service"));
const validators_1 = require("../../utils/validators");
class BuildingController {
    async create(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.createBuildingSchema, req.body);
            console.log('Creating building with input:', input, 'for org:', req.user.organizationId);
            const building = await building_service_1.default.createBuilding(req.user.organizationId, req.user.userId, input);
            res.status(201).json({ data: building });
        }
        catch (error) {
            console.error('Building create error:', error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { page, limit } = req.query;
            const result = await building_service_1.default.getBuildings(req.user.organizationId, page, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const building = await building_service_1.default.getBuildingById(req.user.organizationId, req.params.id);
            res.status(200).json(building);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.createBuildingSchema, req.body);
            const building = await building_service_1.default.updateBuilding(req.user.organizationId, req.user.userId, req.params.id, input);
            res.status(200).json(building);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const result = await building_service_1.default.deleteBuilding(req.user.organizationId, req.user.userId, req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.BuildingController = BuildingController;
exports.default = new BuildingController();
//# sourceMappingURL=building.controller.js.map