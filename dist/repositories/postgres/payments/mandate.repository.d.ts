import { Mandate } from '../../../models/postgres/payments/mandate.entity';
export declare class MandateRepository {
    private repository;
    private getRepository;
    create(mandateData: Partial<Mandate>): Promise<Mandate>;
    findById(id: string): Promise<Mandate | null>;
    findByUserId(userId: string, status?: string): Promise<Mandate[]>;
    findActiveMandates(): Promise<Mandate[]>;
    update(id: string, updates: Partial<Mandate>): Promise<Mandate>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=mandate.repository.d.ts.map