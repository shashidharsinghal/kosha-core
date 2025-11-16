import { Router } from 'express';
import { InvestmentController } from '../../controllers/investments/investment.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const investmentController = new InvestmentController();

// All routes require authentication
router.use(authenticateToken);

router.get('/', (req, res) => investmentController.listInvestments(req as any, res));
router.get('/summary', (req, res) => investmentController.getPortfolioSummary(req as any, res));
router.get('/:assetId/price', (req, res) => investmentController.fetchLivePrice(req as any, res));
router.get('/:assetId/history', (req, res) => investmentController.getPriceHistory(req as any, res));
router.get('/:assetId/transactions', (req, res) => investmentController.getTransactionHistory(req as any, res));
router.post('/assets', (req, res) => investmentController.addAsset(req as any, res));
router.post('/transactions', (req, res) => investmentController.addTransaction(req as any, res));
router.patch('/assets/:assetId', (req, res) => investmentController.updateAsset(req as any, res));
router.patch('/transactions/:transactionId', (req, res) => investmentController.updateTransaction(req as any, res));
router.delete('/transactions/:transactionId', (req, res) => investmentController.deleteTransaction(req as any, res));

export default router;

