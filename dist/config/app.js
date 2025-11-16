"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./database");
const swagger_1 = require("./swagger");
const auth_routes_1 = __importDefault(require("../routes/authentication/auth.routes"));
const bill_routes_1 = __importDefault(require("../routes/bills/bill.routes"));
const expense_routes_1 = __importDefault(require("../routes/expenses/expense.routes"));
const income_routes_1 = __importDefault(require("../routes/income/income.routes"));
const investment_routes_1 = __importDefault(require("../routes/investments/investment.routes"));
const payment_routes_1 = __importDefault(require("../routes/payments/payment.routes"));
const notification_routes_1 = __importDefault(require("../routes/notifications/notification.routes"));
const dashboard_routes_1 = __importDefault(require("../routes/dashboard/dashboard.routes"));
const errorHandler_1 = require("../middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    // Body parsing
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    });
    app.use('/api/', limiter);
    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Setup Swagger UI (only in non-production environments)
    if (process.env.NODE_ENV !== 'production') {
        (0, swagger_1.setupSwagger)(app);
    }
    return app;
}
async function startServer() {
    const app = createApp();
    const port = process.env.PORT || 3000;
    // Initialize databases
    await (0, database_1.initializeDatabases)();
    // Register routes
    app.use('/api/v1/auth', auth_routes_1.default);
    app.use('/api/v1/bills', bill_routes_1.default);
    app.use('/api/v1/expenses', expense_routes_1.default);
    app.use('/api/v1/income', income_routes_1.default);
    app.use('/api/v1/investments', investment_routes_1.default);
    app.use('/api/v1/payments', payment_routes_1.default);
    app.use('/api/v1/notifications', notification_routes_1.default);
    app.use('/api/v1/dashboard', dashboard_routes_1.default);
    // Error handling middleware (must be last)
    app.use(errorHandler_1.errorHandler);
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}
//# sourceMappingURL=app.js.map