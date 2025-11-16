"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        throw new errorHandler_1.AppError(401, 'UNAUTHORIZED', 'Authentication token required');
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new errorHandler_1.AppError(500, 'CONFIG_ERROR', 'JWT secret not configured');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = decoded.userId;
        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Invalid or expired token');
    }
}
//# sourceMappingURL=auth.js.map