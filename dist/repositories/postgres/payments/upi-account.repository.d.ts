import { UPIAccount } from '../../../models/postgres/payments/upi-account.entity';
export declare class UPIAccountRepository {
    private repository;
    private getRepository;
    create(accountData: Partial<UPIAccount>): Promise<UPIAccount>;
    findById(id: string): Promise<UPIAccount | null>;
    findByUserId(userId: string): Promise<UPIAccount[]>;
    findActiveByUserId(userId: string): Promise<UPIAccount[]>;
    update(id: string, updates: Partial<UPIAccount>): Promise<UPIAccount>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=upi-account.repository.d.ts.map