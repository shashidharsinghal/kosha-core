import { IIncome } from '../../models/mongodb/income/income.schema';
export declare class IncomeService {
    private incomeRepository;
    constructor();
    addIncome(userId: string, incomeData: Partial<IIncome>): Promise<IIncome>;
    updateIncome(incomeId: string, userId: string, updates: Partial<IIncome>): Promise<IIncome>;
    listIncomes(userId: string, filters?: {
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
        page: number;
        limit: number;
    }>;
    deleteIncome(incomeId: string, userId: string): Promise<{
        success: boolean;
    }>;
    importIncomes(userId: string): Promise<{
        imported: number;
        failed: number;
    }>;
    getSummary(userId: string, startDate?: Date, endDate?: Date): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byMonth: Record<string, number>;
    }>;
}
//# sourceMappingURL=income.service.d.ts.map