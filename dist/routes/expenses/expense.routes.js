"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("../../controllers/expenses/expense.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const expenseController = new expense_controller_1.ExpenseController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => expenseController.listExpenses(req, res));
router.get('/summary', (req, res) => expenseController.getSummary(req, res));
router.post('/', (req, res) => expenseController.addExpense(req, res));
router.post('/import', (req, res) => expenseController.importExpenses(req, res));
router.patch('/:expenseId', (req, res) => expenseController.updateExpense(req, res));
router.delete('/:expenseId', (req, res) => expenseController.deleteExpense(req, res));
exports.default = router;
//# sourceMappingURL=expense.routes.js.map