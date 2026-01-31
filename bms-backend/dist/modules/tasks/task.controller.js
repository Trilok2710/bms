"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = __importDefault(require("./task.service"));
const validators_1 = require("../../utils/validators");
class TaskController {
    async create(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.createTaskSchema, req.body);
            const task = await task_service_1.default.createTask(req.user.organizationId, req.user.userId, input);
            res.status(201).json({ data: task });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { page, limit } = req.query;
            // If user is a technician, show only assigned tasks
            // If user is admin or supervisor, show all org tasks
            let result;
            if (req.user.role === 'TECHNICIAN') {
                result = await task_service_1.default.getTasksByUser(req.user.organizationId, req.user.userId, page, limit);
            }
            else {
                result = await task_service_1.default.getTasksByOrg(req.user.organizationId, page, limit);
            }
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getMyTasks(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { page, limit } = req.query;
            const result = await task_service_1.default.getTasksByUser(req.user.organizationId, req.user.userId, page, limit);
            res.status(200).json({ data: result });
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
            const task = await task_service_1.default.getTaskById(req.user.organizationId, req.params.id);
            res.status(200).json(task);
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
            const input = (0, validators_1.validateData)(validators_1.createTaskSchema, req.body);
            const task = await task_service_1.default.updateTask(req.user.organizationId, req.user.userId, req.params.id, input);
            res.status(200).json(task);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async assignUsers(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { assignedUserIds } = req.body;
            const task = await task_service_1.default.assignTask(req.user.organizationId, req.user.userId, req.params.id, assignedUserIds);
            res.status(200).json(task);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getAvailableTasksForReading(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tasks = await task_service_1.default.getAvailableTasksForReading(req.user.organizationId, req.user.userId);
            res.status(200).json({ data: tasks });
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
            const result = await task_service_1.default.deleteTask(req.user.organizationId, req.user.userId, req.params.id);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.TaskController = TaskController;
exports.default = new TaskController();
//# sourceMappingURL=task.controller.js.map