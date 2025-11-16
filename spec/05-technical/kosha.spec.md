// Kosha – Personal Finance App Specification

This document outlines the **feature‑level specification** and **high‑level architecture** for **Kosha – Your Wealth, Your Way**, a personal finance application that unifies income, expense, investment and bill‑payment management.  The specification follows the style of **[spec‑kit](https://github.com/spec-kit/spec‑kit)** so that it can be used with tools like **Cursor** for guided code generation.

## 1. Feature‑Level Specification

Each feature is described using `feature()`, `model()` and `action()` semantics familiar from spec‑kit.  Models define domain entities, while actions describe the operations clients can perform via the API.

### 1.1 Authentication and User Management

```ts
feature("Authentication", () => {
  // Represents an end user of the system
  model("User", () => {
    field("id", "string" /* UUID */);
    field("email", "string");
    field("name", "string");
    field("passwordHash", "string"); // hashed password if using local auth
    field("googleOAuthToken", "string", { optional: true });
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Sign up with email/password or via Google OAuth
  action("register", () => {
    param("email", "string");
    param("password", "string");
    returns("User");
  });

  action("login", () => {
    param("email", "string");
    param("password", "string");
    returns({ token: "string" });
  });

  // Link user's Gmail account to fetch bills
  action("linkGmail", () => {
    param("userId", "string");
    returns({ success: "boolean" });
  });

  // Refresh access token using refresh token
  action("refresh", () => {
    param("refreshToken", "string");
    returns({ token: "string", refreshToken: "string" });
  });

  // Logout and invalidate refresh token
  action("logout", () => {
    param("refreshToken", "string");
    returns({ success: "boolean" });
  });
});
```

### 1.2 Bill Management

```ts
feature("BillManagement", () => {
  model("Bill", () => {
    field("id", "string");
    field("userId", "string");
    field("title", "string"); // e.g. "Home Loan EMI", "Electricity Bill"
    field("type", enum("LOAN", "SUBSCRIPTION", "CREDIT_CARD", "UTILITY", "OTHER"));
    field("provider", "string", { optional: true }); // lender, merchant or issuer
    field("amount", "decimal");
    field("dueDate", "datetime");
    field("status", enum("PENDING", "PAID", "OVERDUE"));
    field("autopay", "boolean", { default: false });
    field("autopayMandateId", "string", { optional: true });
    field("source", enum("GMAIL", "SMS", "MANUAL"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY", day: 5}
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Automatically ingest bills from Gmail (and potentially SMS)
  action("importBills", () => {
    param("userId", "string");
    returns({ imported: "number", failed: "number" });
  });

  // Manually add or update a bill
  action("upsertBill", () => {
    param("bill", "Bill");
    returns("Bill");
  });

  // Mark a bill as paid after successful payment
  action("markBillPaid", () => {
    param("billId", "string");
    param("paymentId", "string");
    returns("Bill");
  });

  // Retrieve upcoming bills for a user
  action("listUpcomingBills", () => {
    param("userId", "string");
    param("days", "number", { optional: true }); // number of days ahead to look
    returns(["Bill"]);
  });

  // List bills with filters and pagination
  action("listBills", () => {
    param("userId", "string");
    param("status", enum("PENDING", "PAID", "OVERDUE"), { optional: true });
    param("type", enum("LOAN", "SUBSCRIPTION", "CREDIT_CARD", "UTILITY", "OTHER"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "dueDate", "-dueDate"
    returns({ bills: ["Bill"], total: "number", page: "number", limit: "number" });
  });

  // Get recurring bill suggestions based on past patterns
  action("getRecurringSuggestions", () => {
    param("userId", "string");
    returns(["Bill"]); // suggested recurring bills
  });
});
```

### 1.3 Income Tracking

```ts
feature("IncomeTracking", () => {
  model("Income", () => {
    field("id", "string");
    field("userId", "string");
    field("source", "string"); // e.g. "Salary", "Freelance", "Interest"
    field("amount", "decimal");
    field("receivedAt", "datetime");
    field("category", "string", { optional: true });
    field("notes", "string", { optional: true });
    field("importSource", enum("MANUAL", "GMAIL"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY", day: 30}
  });

  action("addIncome", () => {
    param("income", "Income");
    returns("Income");
  });
  action("updateIncome", () => {
    param("income", "Income");
    returns("Income");
  });
  action("listIncomes", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("category", "string", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "receivedAt", "-receivedAt"
    returns({ incomes: ["Income"], total: "number", page: "number", limit: "number" });
  });
  action("deleteIncome", () => {
    param("incomeId", "string");
    returns({ success: "boolean" });
  });
  // Import income entries from Gmail (payroll emails)
  action("importIncomes", () => {
    param("userId", "string");
    returns({ imported: "number", failed: "number" });
  });
  // Get income summary (monthly totals, by category)
  action("getSummary", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns({ total: "decimal", byCategory: "object", byMonth: "object" });
  });
});
```

### 1.4 Expense Management

```ts
feature("ExpenseManagement", () => {
  model("Expense", () => {
    field("id", "string");
    field("userId", "string");
    field("description", "string");
    field("category", "string"); // e.g. "Food", "Transportation"
    field("amount", "decimal");
    field("spentAt", "datetime");
    field("paymentMethod", enum("CASH", "CARD", "UPI", "OTHER"));
    field("notes", "string", { optional: true });
    field("source", enum("MANUAL", "UPI", "SMS", "CARD"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY"}
  });
  action("addExpense", () => {
    param("expense", "Expense");
    returns("Expense");
  });
  action("updateExpense", () => {
    param("expense", "Expense");
    returns("Expense");
  });
  action("listExpenses", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("category", "string", { optional: true });
    param("paymentMethod", enum("CASH", "CARD", "UPI", "OTHER"), { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "spentAt", "-spentAt"
    returns({ expenses: ["Expense"], total: "number", page: "number", limit: "number" });
  });
  action("deleteExpense", () => {
    param("expenseId", "string");
    returns({ success: "boolean" });
  });
  // Import expenses from external sources (UPI, card statements)
  action("importExpenses", () => {
    param("userId", "string");
    param("source", enum("UPI", "CARD", "SMS"));
    returns({ imported: "number", failed: "number" });
  });
  // Get expense summary (category breakdown, monthly totals, burn rate)
  action("getSummary", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns({ total: "decimal", byCategory: "object", byMonth: "object", burnRate: "decimal" });
  });
});
```

### 1.5 Investment Monitoring

```ts
feature("InvestmentMonitoring", () => {
  model("Investment", () => {
    field("id", "string");
    field("userId", "string");
    field("type", enum("MUTUAL_FUND", "STOCK", "FIXED_DEPOSIT", "BOND", "OTHER"));
    field("name", "string");
    field("quantity", "decimal", { optional: true });
    field("purchaseValue", "decimal");
    field("currentValue", "decimal", { optional: true });
    field("purchasedAt", "datetime");
    field("institution", "string", { optional: true });
    field("targetValue", "decimal", { optional: true });
    field("notes", "string", { optional: true });
  });
  action("addInvestment", () => {
    param("investment", "Investment");
    returns("Investment");
  });
  action("updateInvestment", () => {
    param("investment", "Investment");
    returns("Investment");
  });
  action("listInvestments", () => {
    param("userId", "string");
    param("type", enum("MUTUAL_FUND", "STOCK", "FIXED_DEPOSIT", "BOND", "OTHER"), { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ investments: ["Investment"], total: "number", page: "number", limit: "number" });
  });
  // Fetch live price data from an external market data API
  action("fetchLivePrice", () => {
    param("investmentId", "string");
    returns({ currentValue: "decimal" });
  });
  // Get portfolio summary (total value, ROI, asset allocation)
  action("getPortfolioSummary", () => {
    param("userId", "string");
    returns({ totalValue: "decimal", totalCost: "decimal", roi: "decimal", byType: "object" });
  });
  // Get historical price data for an investment
  action("getPriceHistory", () => {
    param("investmentId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns([{ date: "datetime", price: "decimal" }]);
  });
});
```

### 1.6 Payment Integration

```ts
feature("Payments", () => {
  model("Payment", () => {
    field("id", "string");
    field("userId", "string");
    field("billId", "string");
    field("amount", "decimal");
    field("paidAt", "datetime");
    field("method", enum("UPI", "CARD", "NETBANKING"));
    field("status", enum("INITIATED", "SUCCESS", "FAILED"));
    field("transactionReference", "string", { optional: true });
    field("upiAccountId", "string", { optional: true });
  });

  model("UPIAccount", () => {
    field("id", "string");
    field("userId", "string");
    field("provider", "string"); // e.g. "Razorpay", "PayU"
    field("upiId", "string");
    field("status", enum("ACTIVE", "INACTIVE", "EXPIRED"));
    field("linkedAt", "datetime");
  });

  model("Mandate", () => {
    field("id", "string");
    field("userId", "string");
    field("billId", "string");
    field("upiAccountId", "string");
    field("amount", "decimal");
    field("frequency", enum("MONTHLY", "YEARLY", "WEEKLY"));
    field("nextDueDate", "datetime");
    field("status", enum("ACTIVE", "PAUSED", "CANCELLED"));
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Link a UPI account via provider OAuth
  action("linkUPIAccount", () => {
    param("userId", "string");
    param("provider", "string");
    returns("UPIAccount");
  });

  // List linked UPI accounts
  action("listAccounts", () => {
    param("userId", "string");
    returns(["UPIAccount"]);
  });

  // Create a UPI Autopay mandate for a recurring bill
  action("createAutopayMandate", () => {
    param("billId", "string");
    param("upiAccountId", "string");
    param("frequency", enum("MONTHLY", "YEARLY", "WEEKLY"));
    returns("Mandate");
  });

  // List mandates for a user
  action("listMandates", () => {
    param("userId", "string");
    param("status", enum("ACTIVE", "PAUSED", "CANCELLED"), { optional: true });
    returns(["Mandate"]);
  });

  // Update mandate (pause, resume, cancel)
  action("updateMandate", () => {
    param("mandateId", "string");
    param("status", enum("ACTIVE", "PAUSED", "CANCELLED"));
    returns("Mandate");
  });

  // Pay a bill on demand via UPI
  action("payBill", () => {
    param("billId", "string");
    param("paymentMethod", enum("UPI", "CARD", "NETBANKING"));
    param("upiAccountId", "string", { optional: true }); // required if method is UPI
    param("idempotencyKey", "string", { optional: true }); // to prevent duplicate payments
    returns("Payment");
  });

  // Get payment history
  action("listPayments", () => {
    param("userId", "string");
    param("billId", "string", { optional: true });
    param("status", enum("INITIATED", "SUCCESS", "FAILED"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ payments: ["Payment"], total: "number", page: "number", limit: "number" });
  });
});
```

### 1.7 Notifications and Reminders

```ts
feature("Notifications", () => {
  model("Notification", () => {
    field("id", "string");
    field("userId", "string");
    field("type", enum("BILL_REMINDER", "PAYMENT_SUCCESS", "PAYMENT_FAILED", "SUMMARY", "INCOME_ALERT", "EXPENSE_ALERT"));
    field("channel", enum("EMAIL", "SMS", "PUSH"));
    field("message", "string");
    field("scheduledAt", "datetime");
    field("sentAt", "datetime", { optional: true });
    field("status", enum("SCHEDULED", "SENT", "FAILED"));
    field("metadata", "object", { optional: true }); // e.g. {billId: "123"}
  });

  model("NotificationPreferences", () => {
    field("id", "string");
    field("userId", "string");
    field("channels", ["string"]); // array of enabled channels
    field("dndStart", "string", { optional: true }); // e.g. "22:00"
    field("dndEnd", "string", { optional: true }); // e.g. "08:00"
    field("timezone", "string", { optional: true });
    field("weeklySummaryDay", "number", { optional: true }); // 0-6 (Sunday-Saturday)
  });

  action("scheduleNotification", () => {
    param("notification", "Notification");
    returns("Notification");
  });
  action("sendNotification", () => {
    param("notificationId", "string");
    returns({ success: "boolean" });
  });
  // Get user notification preferences
  action("getPreferences", () => {
    param("userId", "string");
    returns("NotificationPreferences");
  });
  // Update user notification preferences
  action("updatePreferences", () => {
    param("userId", "string");
    param("preferences", "NotificationPreferences");
    returns("NotificationPreferences");
  });
  // List notifications for a user
  action("listNotifications", () => {
    param("userId", "string");
    param("status", enum("SCHEDULED", "SENT", "FAILED"), { optional: true });
    param("type", enum("BILL_REMINDER", "PAYMENT_SUCCESS", "PAYMENT_FAILED", "SUMMARY", "INCOME_ALERT", "EXPENSE_ALERT"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ notifications: ["Notification"], total: "number", page: "number", limit: "number" });
  });
});
```

### 1.8 Dashboard and Insights

```ts
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
      upcomingBills: ["Bill"],
      expenseDistribution: "object", // by category
      incomeDistribution: "object", // by source
      netWorth: "decimal", // investments + cash - liabilities
      investmentValue: "decimal",
      outstandingBills: "decimal"
    });
  });

  // Get financial health metrics
  action("getHealthMetrics", () => {
    param("userId", "string");
    returns({
      savingsRate: "decimal", // (income - expenses) / income
      expenseToIncomeRatio: "decimal",
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
```

The front‑end can call these endpoints and render graphs using libraries like Recharts or Chart.js.

## 2. High‑Level Architecture (Structurizr DSL)

The diagram below is described using **Structurizr DSL**, following the C4 model.  It provides an end‑to‑end view from the user through the front‑end to the back‑end, databases and external integrations.  The deployment is conceptual and can be adapted for different hosting providers (e.g. AWS, GCP, Vercel).

```dsl
workspace "Kosha – Personal Finance" "High‑level architecture" {
  model {
    user = person "User" {
      description "An end user managing personal finances"
    }

    softwareSystem kosha "Kosha Application" {
      container webApp "Web/Mobile App" "React/Next.js or React Native" {
        description "Client‑side application where users view dashboards, manage bills, expenses, income and investments."
      }
      container backend "Backend API" "Node.js + TypeScript (spec‑kit)" {
        description "Exposes REST/GraphQL endpoints for all features. Handles authentication, business logic and orchestrates external integrations."
      }
      container mongoDB "MongoDB" "Database" {
        description "Primary data store for user documents, bills, expenses and investments."
      }
      container postgres "PostgreSQL" "Relational Database" {
        description "Relational store for structured data such as user accounts and transactional ledgers where ACID transactions are critical."
      }
      container redis "Redis" "In‑memory Cache" {
        description "Caching layer for frequently accessed data (e.g. dashboard summaries, recently imported bills)."
      }
      container gmailService "Gmail Integration Service" "Microservice" {
        description "Polls the user’s Gmail via Gmail API, parses bill notifications and writes to MongoDB. Runs asynchronously via n8n or a background worker."
      }
      container paymentService "Payment Integration Service" "Microservice" {
        description "Handles UPI Autopay and one‑time payments via UPI providers such as Razorpay/PayU. Manages mandates and payment callbacks."
      }
      container notificationService "Notification Service" "Microservice" {
        description "Schedules and sends email/SMS/push notifications for bill reminders, payment confirmations and insights."
      }
    }
    externalSystem gmail "Gmail" {
      description "Google’s email service, accessed via OAuth and Gmail API."
    }
    externalSystem upiProvider "UPI Provider" {
      description "Bank/PSP implementing UPI Autopay and payment APIs (e.g. Razorpay, PayU)."
    }
    externalSystem marketData "Market Data API" {
      description "Third‑party service providing investment price data (stocks, mutual funds)."
    }

    // Relationships
    user -> kosha.webApp "Uses" "HTTPS"
    kosha.webApp -> kosha.backend "Calls API" "REST/GraphQL"
    kosha.backend -> kosha.mongoDB "Reads/Writes" "JDBC/ODM"
    kosha.backend -> kosha.postgres "Reads/Writes" "SQL"
    kosha.backend -> kosha.redis "Reads/Writes" "Redis protocol"
    kosha.backend -> kosha.gmailService "Enqueues tasks" "Message queue"
    kosha.gmailService -> gmail "Fetches emails" "Gmail API"
    kosha.backend -> kosha.paymentService "Initiates payments" "HTTP"
    kosha.paymentService -> upiProvider "Processes UPI payments" "UPI Autopay API"
    kosha.backend -> kosha.notificationService "Queues notifications" "Message queue"
    kosha.notificationService -> gmail "Sends email notifications" "SMTP/Gmail API"
    kosha.backend -> marketData "Fetches live prices" "HTTPS"
  }

  views {
    systemContext kosha "Context diagram" {
      include *
      autolayout lr
    }
    container kosha "Container diagram" {
      include kosha.*
      include user
      include gmail
      include upiProvider
      include marketData
      autolayout lr
    }
    styles {
      element "Person" { shape person; background "#f6c7c7" }
      element "Container" { shape roundedbox; background "#a7c7e7" }
      element "ExternalSystem" { shape hexagon; background "#e0e0e0" }
      relationship { routing direct; }
    }
  }
}
```

## 3. Database and Cache Selection

The application uses a multi-database strategy to optimize for different data access patterns:

| Data category         | Store    | Rationale |
|----------------------|----------|-----------|
| **Bills, expenses, incomes, notifications** | **MongoDB** | Flexible document schema allows rapid iteration across heterogeneous financial objects. Bills and expenses vary in structure (different providers, categories). MongoDB's schema flexibility suits the dynamic nature of users' finance records. |
| **Users, sessions, investment portfolios, payments, mandates, UPI accounts** | **PostgreSQL** | These entities require ACID guarantees, relational integrity, and complex queries. User authentication needs unique constraints; investment monitoring requires joins across assets, transactions, and prices; payments demand transactional consistency. PostgreSQL provides strong consistency and mature SQL capabilities. |
| **Caching dashboards, recent imports, session tokens** | **Redis** | An in‑memory cache speeds up frequent reads and reduces load on the primary databases. Also used as message queue for asynchronous task processing between backend and microservices. |

### Database Choice Rationale

- **MongoDB** is chosen for bills, expenses, incomes, and notifications because:
  - These documents have varying structures (different bill types, expense categories)
  - Rapid schema evolution is needed as new bill sources are added
  - No complex relational queries are required
  - High write throughput for imports

- **PostgreSQL** is chosen for users, investments, and payments because:
  - Strong ACID guarantees are critical for financial transactions
  - Complex queries with joins (e.g., portfolio calculations across assets and transactions)
  - Referential integrity ensures data consistency
  - Mature SQL capabilities for analytical queries

- **Redis** serves dual purpose:
  - Fast caching layer for frequently accessed data (dashboard summaries)
  - Message queue for asynchronous processing (Gmail imports, notifications)

## 4. External Integrations

- **Gmail API**: Use OAuth 2.0 to connect a user’s Gmail account and fetch emails; parse bill notifications using heuristics or machine‑learning models.  According to Gmail’s API docs, authorized apps can list messages and read message content after user consent【394293779798554†L0-L11】.
- **UPI Autopay**: Integrate with providers such as Razorpay or PayU, which expose APIs for creating mandates and executing UPI payments; this allows one‑click bill payment from the user’s UPI account.
- **Market Data API**: Use a third‑party service (e.g. Alpha Vantage or Tiingo) to fetch current prices of stocks and mutual funds for investments.
- **Notification Channels**: Send emails via Gmail API or SMTP; send SMS via a provider such as Twilio or an India‑specific gateway; push notifications via browser/mobile push services.

## 5. Evolution and Maintenance

The feature specs above are modular; new features can be added by creating new `feature()` blocks and associated models/actions.  The Structurizr architecture specification can evolve by adding containers or components.  When using Cursor, you can reference these specs to generate boilerplate code for controllers, database models and services, ensuring consistency with the defined domain models.
