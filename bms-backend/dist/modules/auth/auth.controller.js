"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const validators_1 = require("../../utils/validators");
class AuthController {
    async register(req, res) {
        try {
            const input = (0, validators_1.validateData)(validators_1.registerSchema, req.body);
            const result = await auth_service_1.default.register(input);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const input = (0, validators_1.validateData)(validators_1.loginSchema, req.body);
            const result = await auth_service_1.default.login(input);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const user = await auth_service_1.default.getMe(req.user.userId);
            res.status(200).json(user);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map