export declare class Payment {
    id: string;
    userId: string;
    billId?: string;
    amount: number;
    paidAt?: Date;
    initiatedAt: Date;
    method: string;
    status: string;
    transactionReference?: string;
    upiAccountId?: string;
    errorCode?: string;
    errorMessage?: string;
}
//# sourceMappingURL=payment.entity.d.ts.map