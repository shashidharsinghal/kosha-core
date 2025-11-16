import { Router } from 'express';
import { PaymentController } from '../../controllers/payments/payment.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

// All routes require authentication
router.use(authenticateToken);

// UPI Account routes
router.get('/accounts', (req, res) => paymentController.listAccounts(req as any, res));
router.post('/link-upi', (req, res) => paymentController.linkUPIAccount(req as any, res));

// Mandate routes
router.get('/mandates', (req, res) => paymentController.listMandates(req as any, res));
router.post('/mandates', (req, res) => paymentController.createAutopayMandate(req as any, res));
router.patch('/mandates/:mandateId', (req, res) => paymentController.updateMandate(req as any, res));

// Payment routes
router.get('/', (req, res) => paymentController.listPayments(req as any, res));
router.get('/:paymentId', (req, res) => paymentController.getPaymentStatus(req as any, res));
router.post('/bills/:billId', (req, res) => paymentController.payBill(req as any, res));

export default router;

