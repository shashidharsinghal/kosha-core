import { IIncome } from '../../../models/mongodb/income/income.schema';
export declare class IncomeRepository {
    create(incomeData: Partial<IIncome>): Promise<IIncome>;
    findById(id: string): Promise<IIncome | null>;
    findByUserId(userId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
    }, pagination?: {
        page: number;
        limit: number;
        sort?: string;
    }): Promise<{
        incomes: IIncome[];
        total: number;
    }>;
    getSummary(userId: string, startDate?: Date, endDate?: Date): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byMonth: Record<string, number>;
    }>;
    update(id: string, updates: Partial<IIncome>): Promise<IIncome | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=income.repository.d.ts.map