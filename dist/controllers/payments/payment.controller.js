"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../../services/payments/payment.service");
class PaymentController {
    constructor() {
        this.paymentService = new payment_service_1.PaymentService();
    }
    async linkUPIAccount(req, res) {
        const userId = req.userId;
        const { provider, oauthCode } = req.body;
        if (!provider || !oauthCode) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Provider and OAuth code are required' },
            });
            return;
        }
        try {
            const account = await this.paymentService.linkUPIAccount(userId, provider, oauthCode);
            res.status(201).json({ data: account });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listAccounts(req, res) {
        const userId = req.userId;
        try {
            const accounts = await this.paymentService.listAccounts(userId);
            res.status(200).json({ data: accounts });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async createAutopayMandate(req, res) {
        const userId = req.userId;
        const { billId, upiAccountId, frequency } = req.body;
        if (!billId || !upiAccountId || !frequency) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Bill ID, UPI account ID, and frequency are required' },
            });
            return;
        }
        try {
            const mandate = await this.paymentService.createAutopayMandate(billId, upiAccountId, frequency, userId);
            res.status(201).json({ data: mandate });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listMandates(req, res) {
        const userId = req.userId;
        const { status } = req.query;
        try {
            const mandates = await this.paymentService.listMandates(userId, status);
            res.status(200).json({ data: mandates });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async updateMandate(req, res) {
        const userId = req.userId;
        const { mandateId } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Status is required' },
            });
            return;
        }
        try {
            const mandate = await this.paymentService.updateMandate(mandateId, status, userId);
            res.status(200).json({ data: mandate });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async payBill(req, res) {
        const userId = req.userId;
        const { billId } = req.params;
        const { paymentMethod, upiAccountId, idempotencyKey } = req.body;
        if (!paymentMethod) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Payment method is required' },
            });
            return;
        }
        try {
            const payment = await this.paymentService.payBill(billId, paymentMethod, userId, upiAccountId, idempotencyKey);
            res.status(202).json({ data: payment });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listPayments(req, res) {
        const userId = req.userId;
        const { billId, status, startDate, endDate, page = '1', limit = '20', } = req.query;
        try {
            const filters = {};
            if (billId)
                filters.billId = billId;
            if (status)
                filters.status = status;
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
            };
            const result = await this.paymentService.listPayments(userId, filters, pagination);
            res.status(200).json({
                data: result.payments,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getPaymentStatus(req, res) {
        const userId = req.userId;
        const { paymentId } = req.params;
        try {
            const payment = await this.paymentService.getPaymentStatus(paymentId, userId);
            res.status(200).json({ data: payment });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map