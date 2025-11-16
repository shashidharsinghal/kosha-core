import { Router } from 'express';
import { ExpenseController } from '../../controllers/expenses/expense.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const expenseController = new ExpenseController();

// All routes require authentication
router.use(authenticateToken);

router.get('/', (req, res) => expenseController.listExpenses(req as any, res));
router.get('/summary', (req, res) => expenseController.getSummary(req as any, res));
router.post('/', (req, res) => expenseController.addExpense(req as any, res));
router.post('/import', (req, res) => expenseController.importExpenses(req as any, res));
router.patch('/:expenseId', (req, res) => expenseController.updateExpense(req as any, res));
router.delete('/:expenseId', (req, res) => expenseController.deleteExpense(req as any, res));

export default router;

