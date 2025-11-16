"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../../repositories/postgres/authentication/user.repository");
const user_session_repository_1 = require("../../repositories/postgres/authentication/user-session.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.sessionRepository = new user_session_repository_1.UserSessionRepository();
    }
    async register(email, password, name) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new errorHandler_1.AppError(409, 'EMAIL_EXISTS', 'Email already registered');
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await this.userRepository.create({
            email,
            name: name || email.split('@')[0],
            passwordHash,
        });
        return user;
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new errorHandler_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            throw new errorHandler_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        const { token, refreshToken } = await this.generateTokens(user);
        await this.createSession(user.id, refreshToken);
        return { token, refreshToken, user };
    }
    async refresh(refreshToken) {
        const session = await this.sessionRepository.findByRefreshToken(refreshToken);
        if (!session || session.expiresAt < new Date()) {
            throw new errorHandler_1.AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
        }
        const user = await this.userRepository.findById(session.userId);
        if (!user) {
            throw new errorHandler_1.AppError(404, 'USER_NOT_FOUND', 'User not found');
        }
        await this.sessionRepository.delete(refreshToken);
        const { token, refreshToken: newRefreshToken } = await this.generateTokens(user);
        await this.createSession(user.id, newRefreshToken);
        return { token, refreshToken: newRefreshToken };
    }
    async logout(refreshToken) {
        await this.sessionRepository.delete(refreshToken);
        return { success: true };
    }
    async linkGmail(userId, oauthCode) {
        // TODO: Implement Gmail OAuth flow
        // 1. Exchange oauthCode for access token and refresh token
        // 2. Store refresh token in user record
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.AppError(404, 'USER_NOT_FOUND', 'User not found');
        }
        // Placeholder - implement actual OAuth flow
        await this.userRepository.update(userId, {
            gmailRefreshToken: oauthCode, // This should be the actual refresh token
        });
        return { success: true };
    }
    async generateTokens(user) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new errorHandler_1.AppError(500, 'CONFIG_ERROR', 'JWT secret not configured');
        }
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret) {
            throw new errorHandler_1.AppError(500, 'CONFIG_ERROR', 'JWT refresh secret not configured');
        }
        // Use type assertion to bypass strict type checking for expiresIn
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, refreshSecret, { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') });
        return { token, refreshToken };
    }
    async createSession(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await this.sessionRepository.create({
            userId,
            refreshToken,
            expiresAt,
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map