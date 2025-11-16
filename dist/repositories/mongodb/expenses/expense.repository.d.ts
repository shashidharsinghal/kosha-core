import { IExpense } from '../../../models/mongodb/expenses/expense.schema';
export declare class ExpenseRepository {
    create(expenseData: Partial<IExpense>): Promise<IExpense>;
    findById(id: string): Promise<IExpense | null>;
    findByUserId(userId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
        paymentMethod?: string;
    }, pagination?: {
        page: number;
        limit: number;
        sort?: string;
    }): Promise<{
        expenses: IExpense[];
        total: number;
    }>;
    getSummary(userId: string, startDate?: Date, endDate?: Date): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byMonth: Record<string, number>;
    }>;
    update(id: string, updates: Partial<IExpense>): Promise<IExpense | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=expense.repository.d.ts.map