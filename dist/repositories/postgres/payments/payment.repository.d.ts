import { Payment } from '../../../models/postgres/payments/payment.entity';
export declare class PaymentRepository {
    private repository;
    private getRepository;
    create(paymentData: Partial<Payment>): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByUserId(userId: string, filters?: {
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
    }>;
    update(id: string, updates: Partial<Payment>): Promise<Payment>;
}
//# sourceMappingURL=payment.repository.d.ts.map