"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgController = void 0;
const org_service_1 = __importDefault(require("./org.service"));
class OrgController {
    async getDetails(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const org = await org_service_1.default.getOrgDetails(req.user.organizationId);
            res.status(200).json(org);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getUsers(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const users = await org_service_1.default.getOrgUsers(req.user.organizationId);
            res.status(200).json(users);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getInviteCode(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const org = await org_service_1.default.getOrgDetails(req.user.organizationId);
            res.status(200).json({ inviteCode: org.inviteCode });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async regenerateInviteCode(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const org = await org_service_1.default.regenerateInviteCode(req.user.organizationId, req.user.userId);
            res.status(200).json(org);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async deactivateUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { userId } = req.params;
            const user = await org_service_1.default.deactivateUser(req.user.organizationId, req.user.userId, userId);
            res.status(200).json(user);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.OrgController = OrgController;
exports.default = new OrgController();
//# sourceMappingURL=org.controller.js.map