"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("../../repositories/postgres/payments/payment.repository");
const upi_account_repository_1 = require("../../repositories/postgres/payments/upi-account.repository");
const mandate_repository_1 = require("../../repositories/postgres/payments/mandate.repository");
const errorHandler_1 = require("../../middleware/errorHandler");
class PaymentService {
    constructor() {
        this.paymentRepository = new payment_repository_1.PaymentRepository();
        this.upiAccountRepository = new upi_account_repository_1.UPIAccountRepository();
        this.mandateRepository = new mandate_repository_1.MandateRepository();
    }
    async linkUPIAccount(userId, provider, oauthCode) {
        // TODO: Implement OAuth flow with UPI provider
        // Exchange oauthCode for tokens and store securely
        // Placeholder implementation
        const upiId = `upi@${provider.toLowerCase()}`; // This should come from OAuth response
        return await this.upiAccountRepository.create({
            userId,
            provider,
            upiId,
            status: 'ACTIVE',
            linkedAt: new Date(),
            token: oauthCode, // This should be encrypted
        });
    }
    async listAccounts(userId) {
        return await this.upiAccountRepository.findByUserId(userId);
    }
    async createAutopayMandate(billId, upiAccountId, frequency, userId) {
        const account = await this.upiAccountRepository.findById(upiAccountId);
        if (!account) {
            throw new errorHandler_1.AppError(404, 'ACCOUNT_NOT_FOUND', 'UPI account not found');
        }
        if (account.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot create mandate for another user\'s account');
        }
        // TODO: Call UPI provider API to create mandate
        // For now, calculate next due date based on frequency
        const nextDueDate = new Date();
        if (frequency === 'MONTHLY') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }
        else if (frequency === 'YEARLY') {
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        }
        else if (frequency === 'WEEKLY') {
            nextDueDate.setDate(nextDueDate.getDate() + 7);
        }
        return await this.mandateRepository.create({
            userId,
            billId,
            upiAccountId,
            amount: 0, // Should get from bill
            frequency,
            nextDueDate,
            status: 'ACTIVE',
        });
    }
    async listMandates(userId, status) {
        return await this.mandateRepository.findByUserId(userId, status);
    }
    async updateMandate(mandateId, status, userId) {
        const mandate = await this.mandateRepository.findById(mandateId);
        if (!mandate) {
            throw new errorHandler_1.AppError(404, 'MANDATE_NOT_FOUND', 'Mandate not found');
        }
        if (mandate.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot update mandate belonging to another user');
        }
        return await this.mandateRepository.update(mandateId, { status });
    }
    async payBill(billId, paymentMethod, userId, upiAccountId, idempotencyKey) {
        // TODO: Validate bill exists and get amount
        // TODO: Check idempotency key to prevent duplicate payments
        // TODO: Call payment provider API
        if (paymentMethod === 'UPI' && !upiAccountId) {
            throw new errorHandler_1.AppError(400, 'UPI_ACCOUNT_REQUIRED', 'UPI account ID is required for UPI payments');
        }
        const payment = await this.paymentRepository.create({
            userId,
            billId,
            amount: 0, // Should get from bill
            method: paymentMethod,
            status: 'INITIATED',
            initiatedAt: new Date(),
            upiAccountId,
        });
        // TODO: Process payment asynchronously
        // Update status based on provider response
        return payment;
    }
    async listPayments(userId, filters = {}, pagination = { page: 1, limit: 20 }) {
        const { payments, total } = await this.paymentRepository.findByUserId(userId, filters, pagination);
        return { payments, total, page: pagination.page, limit: pagination.limit };
    }
    async getPaymentStatus(paymentId, userId) {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new errorHandler_1.AppError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
        }
        if (payment.userId !== userId) {
            throw new errorHandler_1.AppError(403, 'FORBIDDEN', 'Cannot access payment belonging to another user');
        }
        // TODO: Poll payment provider for latest status if still pending
        return payment;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map