"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const staff_service_1 = __importDefault(require("./staff.service"));
const validators_1 = require("../../utils/validators");
class StaffController {
    async getAll(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;
            const staff = await staff_service_1.default.getAllStaff(req.user.organizationId, skip, limit);
            const total = await staff_service_1.default.countStaff(req.user.organizationId);
            res.status(200).json({
                data: {
                    staff: staff.map(s => ({
                        id: s.id,
                        email: s.email,
                        name: s.name,
                        role: s.role,
                        createdAt: s.createdAt
                    })),
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async invite(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.registerSchema, req.body);
            const staff = await staff_service_1.default.inviteStaff(req.user.organizationId, req.user.userId, input);
            res.status(201).json(staff);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getByRole(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { role } = req.params;
            const staff = await staff_service_1.default.getStaffByRole(req.user.organizationId, role.toUpperCase());
            res.status(200).json(staff);
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
            const staff = await staff_service_1.default.getStaffById(req.user.organizationId, req.params.id);
            res.status(200).json(staff);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async updateRole(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { role } = req.body;
            const staff = await staff_service_1.default.updateStaffRole(req.user.organizationId, req.user.userId, req.params.id, role);
            res.status(200).json(staff);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async deactivate(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const result = await staff_service_1.default.deactivateStaff(req.user.organizationId, req.user.userId, req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.StaffController = StaffController;
exports.default = new StaffController();
//# sourceMappingURL=staff.controller.js.map