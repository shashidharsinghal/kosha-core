/*
 * Dashboard and Insights feature specification.
 * Defines actions for aggregating financial data and providing insights.
 * Aggregates data from multiple features (bills, expenses, income, investments) to provide comprehensive financial overview.
 */

feature("Dashboard", () => {
  // Get comprehensive financial summary
  action("getSummary", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns({
      totalIncome: "decimal",
      totalExpenses: "decimal",
      netSavings: "decimal",
      upcomingBills: ["Bill"], // bills due in next 30 days
      expenseDistribution: "object", // by category: {Food: 5000, Transport: 3000, ...}
      incomeDistribution: "object", // by source: {Salary: 50000, Freelance: 10000, ...}
      netWorth: "decimal", // investments + cash - liabilities
      investmentValue: "decimal",
      outstandingBills: "decimal"
    });
  });

  // Get financial health metrics
  action("getHealthMetrics", () => {
    param("userId", "string");
    param("period", enum("WEEK", "MONTH", "QUARTER", "YEAR"), { optional: true, default: "MONTH" });
    returns({
      savingsRate: "decimal", // (income - expenses) / income
      expenseToIncomeRatio: "decimal", // expenses / income
      billPaymentRate: "decimal", // % of bills paid on time
      investmentGrowth: "decimal", // ROI %
      cashFlow: "decimal" // income - expenses for period
    });
  });

  // Get trends over time
  action("getTrends", () => {
    param("userId", "string");
    param("period", enum("WEEK", "MONTH", "QUARTER", "YEAR"));
    param("metric", enum("INCOME", "EXPENSE", "SAVINGS", "INVESTMENT"));
    returns([{ date: "datetime", value: "decimal" }]);
  });
});

