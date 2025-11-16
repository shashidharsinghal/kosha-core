import { PaymentRepository } from '../../repositories/postgres/payments/payment.repository';
import { UPIAccountRepository } from '../../repositories/postgres/payments/upi-account.repository';
import { MandateRepository } from '../../repositories/postgres/payments/mandate.repository';
import { AppError } from '../../middleware/errorHandler';
import { Payment } from '../../models/postgres/payments/payment.entity';
import { UPIAccount } from '../../models/postgres/payments/upi-account.entity';
import { Mandate } from '../../models/postgres/payments/mandate.entity';

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private upiAccountRepository: UPIAccountRepository;
  private mandateRepository: MandateRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.upiAccountRepository = new UPIAccountRepository();
    this.mandateRepository = new MandateRepository();
  }

  async linkUPIAccount(userId: string, provider: string, oauthCode: string): Promise<UPIAccount> {
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

  async listAccounts(userId: string): Promise<UPIAccount[]> {
    return await this.upiAccountRepository.findByUserId(userId);
  }

  async createAutopayMandate(
    billId: string,
    upiAccountId: string,
    frequency: 'MONTHLY' | 'YEARLY' | 'WEEKLY',
    userId: string
  ): Promise<Mandate> {
    const account = await this.upiAccountRepository.findById(upiAccountId);
    if (!account) {
      throw new AppError(404, 'ACCOUNT_NOT_FOUND', 'UPI account not found');
    }
    if (account.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot create mandate for another user\'s account');
    }

    // TODO: Call UPI provider API to create mandate
    // For now, calculate next due date based on frequency
    const nextDueDate = new Date();
    if (frequency === 'MONTHLY') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else if (frequency === 'YEARLY') {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    } else if (frequency === 'WEEKLY') {
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

  async listMandates(userId: string, status?: string): Promise<Mandate[]> {
    return await this.mandateRepository.findByUserId(userId, status);
  }

  async updateMandate(
    mandateId: string,
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED',
    userId: string
  ): Promise<Mandate> {
    const mandate = await this.mandateRepository.findById(mandateId);
    if (!mandate) {
      throw new AppError(404, 'MANDATE_NOT_FOUND', 'Mandate not found');
    }
    if (mandate.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update mandate belonging to another user');
    }

    return await this.mandateRepository.update(mandateId, { status });
  }

  async payBill(
    billId: string,
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING',
    userId: string,
    upiAccountId?: string,
    idempotencyKey?: string
  ): Promise<Payment> {
    // TODO: Validate bill exists and get amount
    // TODO: Check idempotency key to prevent duplicate payments
    // TODO: Call payment provider API

    if (paymentMethod === 'UPI' && !upiAccountId) {
      throw new AppError(400, 'UPI_ACCOUNT_REQUIRED', 'UPI account ID is required for UPI payments');
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

  async listPayments(
    userId: string,
    filters: {
      billId?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ payments: Payment[]; total: number; page: number; limit: number }> {
    const { payments, total } = await this.paymentRepository.findByUserId(userId, filters, pagination);
    return { payments, total, page: pagination.page, limit: pagination.limit };
  }

  async getPaymentStatus(paymentId: string, userId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new AppError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
    }
    if (payment.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot access payment belonging to another user');
    }

    // TODO: Poll payment provider for latest status if still pending
    return payment;
  }
}

