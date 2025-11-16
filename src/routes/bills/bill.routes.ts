import { Router } from 'express';
import { BillController } from '../../controllers/bills/bill.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const billController = new BillController();

// All routes require authentication
router.use(authenticateToken);

router.get('/', (req, res) => billController.listBills(req as any, res));
router.get('/upcoming', (req, res) => billController.listUpcomingBills(req as any, res));
router.get('/recurring-suggestions', (req, res) => billController.getRecurringSuggestions(req as any, res));
router.post('/', (req, res) => billController.upsertBill(req as any, res));
router.post('/import', (req, res) => billController.importBills(req as any, res));
router.patch('/:billId/paid', (req, res) => billController.markBillPaid(req as any, res));

export default router;

