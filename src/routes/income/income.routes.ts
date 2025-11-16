import { Router } from 'express';
import { IncomeController } from '../../controllers/income/income.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const incomeController = new IncomeController();

// All routes require authentication
router.use(authenticateToken);

router.get('/', (req, res) => incomeController.listIncomes(req as any, res));
router.get('/summary', (req, res) => incomeController.getSummary(req as any, res));
router.post('/', (req, res) => incomeController.addIncome(req as any, res));
router.post('/import', (req, res) => incomeController.importIncomes(req as any, res));
router.patch('/:incomeId', (req, res) => incomeController.updateIncome(req as any, res));
router.delete('/:incomeId', (req, res) => incomeController.deleteIncome(req as any, res));

export default router;

