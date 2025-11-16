"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../../services/authentication/auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async register(req, res) {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
            });
            return;
        }
        try {
            const user = await this.authService.register(email, password, name);
            res.status(201).json({ data: user });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
            });
            return;
        }
        try {
            const result = await this.authService.login(email, password);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' },
            });
            return;
        }
        try {
            const result = await this.authService.refresh(refreshToken);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async logout(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' },
            });
            return;
        }
        try {
            const result = await this.authService.logout(refreshToken);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async linkGmail(req, res) {
        const userId = req.userId;
        const { oauthCode } = req.body;
        if (!oauthCode) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'OAuth code is required' },
            });
            return;
        }
        try {
            const result = await this.authService.linkGmail(userId, oauthCode);
            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map