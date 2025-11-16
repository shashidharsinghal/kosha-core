import { BillService } from '../bills/bill.service';
import { ExpenseService } from '../expenses/expense.service';
import { IncomeService } from '../income/income.service';
import { InvestmentService } from '../investments/investment.service';
import { getRedisClient } from '../../config/database';

export class DashboardService {
  private billService: BillService;
  private expenseService: ExpenseService;
  private incomeService: IncomeService;
  private investmentService: InvestmentService;

  constructor() {
    this.billService = new BillService();
    this.expenseService = new ExpenseService();
    this.incomeService = new IncomeService();
    this.investmentService = new InvestmentService();
  }

  async getSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    upcomingBills: any[];
    expenseDistribution: Record<string, number>;
    incomeDistribution: Record<string, number>;
    netWorth: number;
    investmentValue: number;
    outstandingBills: number;
  }> {
    // Try to get from cache first
    const cacheKey = `dashboard:summary:${userId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached as any;
    }

    const [incomeSummary, expenseSummary, upcomingBills, portfolioSummary, bills] = await Promise.all([
      this.incomeService.getSummary(userId, startDate, endDate),
      this.expenseService.getSummary(userId, startDate, endDate),
      this.billService.listUpcomingBills(userId, 30),
      this.investmentService.getPortfolioSummary(userId),
      this.billService.listBills(userId, { status: 'PENDING' }),
    ]);

    const totalIncome = incomeSummary.total;
    const totalExpenses = expenseSummary.total;
    const netSavings = totalIncome - totalExpenses;
    const investmentValue = portfolioSummary.totalValue;
    const outstandingBills = bills.bills.reduce((sum, bill) => sum + bill.amount, 0);
    const netWorth = investmentValue - outstandingBills;

    const result = {
      totalIncome,
      totalExpenses,
      netSavings,
      upcomingBills: upcomingBills.slice(0, 10), // Top 10
      expenseDistribution: expenseSummary.byCategory,
      incomeDistribution: incomeSummary.byCategory,
      netWorth,
      investmentValue,
      outstandingBills,
    };

    // Cache for 5 minutes
    await this.setCache(cacheKey, result, 300);
    return result;
  }

  async getHealthMetrics(
    userId: string,
    period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' = 'MONTH'
  ): Promise<{
    savingsRate: number;
    expenseToIncomeRatio: number;
    billPaymentRate: number;
    investmentGrowth: number;
    cashFlow: number;
  }> {
    const { startDate, endDate } = this.getDateRange(period);
    
    const [incomeSummary, expenseSummary, portfolioSummary, allBills] = await Promise.all([
      this.incomeService.getSummary(userId, startDate, endDate),
      this.expenseService.getSummary(userId, startDate, endDate),
      this.investmentService.getPortfolioSummary(userId),
      this.billService.listBills(userId, { startDate, endDate }),
    ]);

    const totalIncome = incomeSummary.total;
    const totalExpenses = expenseSummary.total;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const expenseToIncomeRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    
    // Calculate bill payment rate (bills paid on time)
    const paidBills = allBills.bills.filter((b) => b.status === 'PAID').length;
    const billPaymentRate = allBills.bills.length > 0 ? (paidBills / allBills.bills.length) * 100 : 0;
    
    const investmentGrowth = portfolioSummary.roiPercentage;
    const cashFlow = totalIncome - totalExpenses;

    return {
      savingsRate,
      expenseToIncomeRatio,
      billPaymentRate,
      investmentGrowth,
      cashFlow,
    };
  }

  async getTrends(
    userId: string,
    period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR',
    metric: 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'INVESTMENT'
  ): Promise<Array<{ date: Date; value: number }>> {
    const { startDate, endDate } = this.getDateRange(period);
    const trends: Array<{ date: Date; value: number }> = [];

    // Group by time period based on metric
    if (metric === 'INCOME' || metric === 'EXPENSE' || metric === 'SAVINGS') {
      const service = metric === 'INCOME' ? this.incomeService : this.expenseService;
      const summary = await service.getSummary(userId, startDate, endDate);
      
      let data: Array<{ date: Date; value: number }>;
      if (metric === 'SAVINGS') {
        data = await this.calculateSavingsTrends(userId, startDate, endDate);
      } else {
        data = Object.entries(summary.byMonth).map(([dateStr, value]) => ({
          date: new Date(dateStr + '-01'),
          value: value as number,
        }));
      }

      trends.push(...data);
    } else if (metric === 'INVESTMENT') {
      const portfolio = await this.investmentService.getPortfolioSummary(userId);
      // TODO: Get historical portfolio values
      trends.push({ date: new Date(), value: portfolio.totalValue });
    }

    return trends.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private async calculateSavingsTrends(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ date: Date; value: number }>> {
    const [incomeSummary, expenseSummary] = await Promise.all([
      this.incomeService.getSummary(userId, startDate, endDate),
      this.expenseService.getSummary(userId, startDate, endDate),
    ]);

    const months = new Set([
      ...Object.keys(incomeSummary.byMonth),
      ...Object.keys(expenseSummary.byMonth),
    ]);

    return Array.from(months).map((monthStr) => ({
      date: new Date(monthStr + '-01'),
      value: (incomeSummary.byMonth[monthStr] || 0) - (expenseSummary.byMonth[monthStr] || 0),
    }));
  }

  private getDateRange(period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'WEEK':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'MONTH':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'QUARTER':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'YEAR':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedisClient();
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  private async setCache(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      const redis = getRedisClient();
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }
}

