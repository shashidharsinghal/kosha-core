"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const bill_service_1 = require("../bills/bill.service");
const expense_service_1 = require("../expenses/expense.service");
const income_service_1 = require("../income/income.service");
const investment_service_1 = require("../investments/investment.service");
const database_1 = require("../../config/database");
class DashboardService {
    constructor() {
        this.billService = new bill_service_1.BillService();
        this.expenseService = new expense_service_1.ExpenseService();
        this.incomeService = new income_service_1.IncomeService();
        this.investmentService = new investment_service_1.InvestmentService();
    }
    async getSummary(userId, startDate, endDate) {
        // Try to get from cache first
        const cacheKey = `dashboard:summary:${userId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
        const cached = await this.getFromCache(cacheKey);
        if (cached) {
            return cached;
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
    async getHealthMetrics(userId, period = 'MONTH') {
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
    async getTrends(userId, period, metric) {
        const { startDate, endDate } = this.getDateRange(period);
        const trends = [];
        // Group by time period based on metric
        if (metric === 'INCOME' || metric === 'EXPENSE' || metric === 'SAVINGS') {
            const service = metric === 'INCOME' ? this.incomeService : this.expenseService;
            const summary = await service.getSummary(userId, startDate, endDate);
            let data;
            if (metric === 'SAVINGS') {
                data = await this.calculateSavingsTrends(userId, startDate, endDate);
            }
            else {
                data = Object.entries(summary.byMonth).map(([dateStr, value]) => ({
                    date: new Date(dateStr + '-01'),
                    value: value,
                }));
            }
            trends.push(...data);
        }
        else if (metric === 'INVESTMENT') {
            const portfolio = await this.investmentService.getPortfolioSummary(userId);
            // TODO: Get historical portfolio values
            trends.push({ date: new Date(), value: portfolio.totalValue });
        }
        return trends.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    async calculateSavingsTrends(userId, startDate, endDate) {
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
    getDateRange(period) {
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
    async getFromCache(key) {
        try {
            const redis = (0, database_1.getRedisClient)();
            const cached = await redis.get(key);
            return cached ? JSON.parse(cached) : null;
        }
        catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    }
    async setCache(key, value, ttlSeconds) {
        try {
            const redis = (0, database_1.getRedisClient)();
            await redis.setEx(key, ttlSeconds, JSON.stringify(value));
        }
        catch (error) {
            console.error('Cache write error:', error);
        }
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map