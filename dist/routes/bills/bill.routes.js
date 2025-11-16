"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bill_controller_1 = require("../../controllers/bills/bill.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const billController = new bill_controller_1.BillController();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => billController.listBills(req, res));
router.get('/upcoming', (req, res) => billController.listUpcomingBills(req, res));
router.get('/recurring-suggestions', (req, res) => billController.getRecurringSuggestions(req, res));
router.post('/', (req, res) => billController.upsertBill(req, res));
router.post('/import', (req, res) => billController.importBills(req, res));
router.patch('/:billId/paid', (req, res) => billController.markBillPaid(req, res));
exports.default = router;
//# sourceMappingURL=bill.routes.js.map