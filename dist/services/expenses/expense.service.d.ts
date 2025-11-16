import { IExpense } from '../../models/mongodb/expenses/expense.schema';
export declare class ExpenseService {
    private expenseRepository;
    constructor();
    addExpense(userId: string, expenseData: Partial<IExpense>): Promise<IExpense>;
    updateExpense(expenseId: string, userId: string, updates: Partial<IExpense>): Promise<IExpense>;
    listExpenses(userId: string, filters?: {
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
        page: number;
        limit: number;
    }>;
    deleteExpense(expenseId: string, userId: string): Promise<{
        success: boolean;
    }>;
    importExpenses(userId: string, source: 'UPI' | 'CARD' | 'SMS'): Promise<{
        imported: number;
        failed: number;
    }>;
    getSummary(userId: string, startDate?: Date, endDate?: Date): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byMonth: Record<string, number>;
        burnRate: number;
    }>;
}
//# sourceMappingURL=expense.service.d.ts.map