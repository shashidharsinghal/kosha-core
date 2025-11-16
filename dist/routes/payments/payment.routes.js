"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../../controllers/payments/payment.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// UPI Account routes
router.get('/accounts', (req, res) => paymentController.listAccounts(req, res));
router.post('/link-upi', (req, res) => paymentController.linkUPIAccount(req, res));
// Mandate routes
router.get('/mandates', (req, res) => paymentController.listMandates(req, res));
router.post('/mandates', (req, res) => paymentController.createAutopayMandate(req, res));
router.patch('/mandates/:mandateId', (req, res) => paymentController.updateMandate(req, res));
// Payment routes
router.get('/', (req, res) => paymentController.listPayments(req, res));
router.get('/:paymentId', (req, res) => paymentController.getPaymentStatus(req, res));
router.post('/bills/:billId', (req, res) => paymentController.payBill(req, res));
exports.default = router;
//# sourceMappingURL=payment.routes.js.map