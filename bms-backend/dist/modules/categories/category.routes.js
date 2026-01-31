"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("./category.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/buildings/:buildingId/categories', role_middleware_1.isAdmin, category_controller_1.default.create.bind(category_controller_1.default));
router.get('/buildings/:buildingId/categories', category_controller_1.default.getByBuilding.bind(category_controller_1.default));
router.patch('/categories/:id', role_middleware_1.isAdmin, category_controller_1.default.update.bind(category_controller_1.default));
router.delete('/categories/:id', role_middleware_1.isAdmin, category_controller_1.default.delete.bind(category_controller_1.default));
exports.default = router;
//# sourceMappingURL=category.routes.js.map