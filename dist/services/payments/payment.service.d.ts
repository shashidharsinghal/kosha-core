import { Payment } from '../../models/postgres/payments/payment.entity';
import { UPIAccount } from '../../models/postgres/payments/upi-account.entity';
import { Mandate } from '../../models/postgres/payments/mandate.entity';
export declare class PaymentService {
    private paymentRepository;
    private upiAccountRepository;
    private mandateRepository;
    constructor();
    linkUPIAccount(userId: string, provider: string, oauthCode: string): Promise<UPIAccount>;
    listAccounts(userId: string): Promise<UPIAccount[]>;
    createAutopayMandate(billId: string, upiAccountId: string, frequency: 'MONTHLY' | 'YEARLY' | 'WEEKLY', userId: string): Promise<Mandate>;
    listMandates(userId: string, status?: string): Promise<Mandate[]>;
    updateMandate(mandateId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED', userId: string): Promise<Mandate>;
    payBill(billId: string, paymentMethod: 'UPI' | 'CARD' | 'NETBANKING', userId: string, upiAccountId?: string, idempotencyKey?: string): Promise<Payment>;
    listPayments(userId: string, filters?: {
        billId?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        payments: Payment[];
        total: number;
        page: number;
        limit: number;
    }>;
    getPaymentStatus(paymentId: string, userId: string): Promise<Payment>;
}
//# sourceMappingURL=payment.service.d.ts.map