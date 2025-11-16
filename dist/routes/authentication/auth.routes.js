"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/authentication/auth.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
// Protected routes
router.post('/link-gmail', auth_1.authenticateToken, (req, res) => authController.linkGmail(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map