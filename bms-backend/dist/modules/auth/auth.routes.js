"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.default.register.bind(auth_controller_1.default));
router.post('/login', auth_controller_1.default.login.bind(auth_controller_1.default));
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.default.getMe.bind(auth_controller_1.default));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map