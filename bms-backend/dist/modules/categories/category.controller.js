"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = __importDefault(require("./category.service"));
const validators_1 = require("../../utils/validators");
class CategoryController {
    async create(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.createCategorySchema, {
                ...req.body,
                buildingId: req.params.buildingId,
            });
            const category = await category_service_1.default.createCategory(req.user.organizationId, req.user.userId, input);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getByBuilding(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const categories = await category_service_1.default.getCategoriesByBuilding(req.user.organizationId, req.params.buildingId);
            res.status(200).json(categories);
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
            const input = (0, validators_1.validateData)(validators_1.createCategorySchema, req.body);
            const category = await category_service_1.default.updateCategory(req.user.organizationId, req.user.userId, req.params.id, input);
            res.status(200).json(category);
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
            const result = await category_service_1.default.deleteCategory(req.user.organizationId, req.user.userId, req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
exports.default = new CategoryController();
//# sourceMappingURL=category.controller.js.map