"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investment_controller_1 = require("../../controllers/investments/investment.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const investmentController = new investment_controller_1.InvestmentController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => investmentController.listInvestments(req, res));
router.get('/summary', (req, res) => investmentController.getPortfolioSummary(req, res));
router.get('/:assetId/price', (req, res) => investmentController.fetchLivePrice(req, res));
router.get('/:assetId/history', (req, res) => investmentController.getPriceHistory(req, res));
router.get('/:assetId/transactions', (req, res) => investmentController.getTransactionHistory(req, res));
router.post('/assets', (req, res) => investmentController.addAsset(req, res));
router.post('/transactions', (req, res) => investmentController.addTransaction(req, res));
router.patch('/assets/:assetId', (req, res) => investmentController.updateAsset(req, res));
router.patch('/transactions/:transactionId', (req, res) => investmentController.updateTransaction(req, res));
router.delete('/transactions/:transactionId', (req, res) => investmentController.deleteTransaction(req, res));
exports.default = router;
//# sourceMappingURL=investment.routes.js.map