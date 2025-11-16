export declare class DashboardService {
    private billService;
    private expenseService;
    private incomeService;
    private investmentService;
    constructor();
    getSummary(userId: string, startDate?: Date, endDate?: Date): Promise<{
        totalIncome: number;
        totalExpenses: number;
        netSavings: number;
        upcomingBills: any[];
        expenseDistribution: Record<string, number>;
        incomeDistribution: Record<string, number>;
        netWorth: number;
        investmentValue: number;
        outstandingBills: number;
    }>;
    getHealthMetrics(userId: string, period?: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'): Promise<{
        savingsRate: number;
        expenseToIncomeRatio: number;
        billPaymentRate: number;
        investmentGrowth: number;
        cashFlow: number;
    }>;
    getTrends(userId: string, period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR', metric: 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'INVESTMENT'): Promise<Array<{
        date: Date;
        value: number;
    }>>;
    private calculateSavingsTrends;
    private getDateRange;
    private getFromCache;
    private setCache;
}
//# sourceMappingURL=dashboard.service.d.ts.map