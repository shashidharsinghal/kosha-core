"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
class AppError extends Error {
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        const response = {
            error: {
                code: err.code,
                message: err.message,
                details: process.env.NODE_ENV === 'development' ? err.details : undefined,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Unexpected errors
    console.error('Unexpected error:', err);
    const response = {
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
    };
    res.status(500).json(response);
}
//# sourceMappingURL=errorHandler.js.map