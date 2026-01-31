"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingController = void 0;
const reading_service_1 = __importDefault(require("./reading.service"));
const validators_1 = require("../../utils/validators");
class ReadingController {
    async submit(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = (0, validators_1.validateData)(validators_1.createReadingSchema, req.body);
            const reading = await reading_service_1.default.submitReading(req.user.organizationId, req.user.userId, input);
            res.status(201).json(reading);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getPending(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { page, limit } = req.query;
            const result = await reading_service_1.default.getPendingReadings(req.user.organizationId, page, limit);
            res.status(200).json(result);
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
            const result = await reading_service_1.default.getAllReadings(req.user.organizationId, page, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async approve(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { comment } = req.body;
            const reading = await reading_service_1.default.approveReading(req.user.organizationId, req.user.userId, req.params.id, comment);
            res.status(200).json(reading);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async reject(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { comment } = req.body;
            const reading = await reading_service_1.default.rejectReading(req.user.organizationId, req.user.userId, req.params.id, comment);
            res.status(200).json(reading);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async addComment(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const input = req.body;
            const comment = await reading_service_1.default.addComment(req.user.organizationId, req.user.userId, req.params.id, input);
            res.status(201).json(comment);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getByCategory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { buildingId, categoryId } = req.params;
            const { page, limit } = req.query;
            const result = await reading_service_1.default.getReadingsByCategory(req.user.organizationId, buildingId, categoryId, page, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getMyHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { page, limit } = req.query;
            const result = await reading_service_1.default.getUserReadingHistory(req.user.organizationId, req.user.userId, page, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.ReadingController = ReadingController;
exports.default = new ReadingController();
//# sourceMappingURL=reading.controller.js.map