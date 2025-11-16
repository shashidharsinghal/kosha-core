"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const income_controller_1 = require("../../controllers/income/income.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const incomeController = new income_controller_1.IncomeController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => incomeController.listIncomes(req, res));
router.get('/summary', (req, res) => incomeController.getSummary(req, res));
router.post('/', (req, res) => incomeController.addIncome(req, res));
router.post('/import', (req, res) => incomeController.importIncomes(req, res));
router.patch('/:incomeId', (req, res) => incomeController.updateIncome(req, res));
router.delete('/:incomeId', (req, res) => incomeController.deleteIncome(req, res));
exports.default = router;
//# sourceMappingURL=income.routes.js.map