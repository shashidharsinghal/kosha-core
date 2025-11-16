# Dashboard Integration Test Flows

This document defines integration test cases for dashboard flows, including financial summary aggregation, health metrics calculation, trend analysis, and cross-feature data integration.

## Test Flow 1: Financial Summary Aggregation

### Test Scenario
Dashboard aggregates data from multiple sources (bills, expenses, income, investments) to provide comprehensive financial overview.

### Prerequisites
- User is registered and authenticated
- User has data across multiple features:
  - Bills (MongoDB)
  - Expenses (MongoDB)
  - Income (MongoDB)
  - Investments (PostgreSQL)
- Dashboard service running
- All feature services accessible

### Test Steps

1. **Create Data Across Features**
   - **Action**: Create bills, expenses, income, and investment entries
   - **Assertions**: Data stored in respective databases

2. **Get Dashboard Summary**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "totalIncome": 150000,
       "totalExpenses": 100000,
       "netSavings": 50000,
       "upcomingBills": [...],
       "expenseDistribution": {
         "Food": 30000,
         "Transport": 25000,
         "Entertainment": 20000,
         "Other": 25000
       },
       "incomeDistribution": {
         "Salary": 100000,
         "Freelance": 30000,
         "Interest": 20000
       },
       "netWorth": 200000,
       "investmentValue": 150000,
       "outstandingBills": 25000
     }
     ```
   - **Assertions**:
     - Total income aggregated from income service
     - Total expenses aggregated from expense service
     - Net savings = total income - total expenses
     - Upcoming bills from bill service
     - Expense distribution accurate
     - Income distribution accurate
     - Net worth calculated correctly
     - Investment value from investment service
     - Outstanding bills calculated

3. **Verify Data Accuracy**
   - **Action**: Compare dashboard data with individual service queries
   - **Assertions**:
     - Income totals match income service
     - Expense totals match expense service
     - Bill data matches bill service
     - Investment data matches investment service
     - Calculations accurate

4. **Verify Date Range Filtering**
   - **Action**: `GET /api/v1/dashboard/summary?startDate=2024-01-01&endDate=2024-03-31`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Only data in date range included
     - Date filtering works across all services

5. **Verify User Isolation**
   - **Action**: Get dashboard for different user
   - **Expected**: Only that user's data returned
   - **Assertions**: User isolation maintained across services

### Expected Results
- Data aggregated correctly from all sources
- Calculations accurate
- Date range filtering works
- User isolation maintained
- Performance acceptable

### Edge Cases

1. **No Data in Any Feature**
   - **Scenario**: User has no bills, expenses, income, or investments
   - **Expected**: Dashboard shows zeros or empty arrays
   - **Assertions**: Handles empty data gracefully

2. **Data in Some Features Only**
   - **Scenario**: User has income but no expenses
   - **Expected**: Dashboard shows available data, zeros for missing
   - **Assertions**: Partial data handling

3. **Large Dataset**
   - **Scenario**: User has thousands of transactions
   - **Expected**: Aggregation efficient, performance acceptable
   - **Assertions**: Efficient querying and aggregation

4. **Data Inconsistency**
   - **Scenario**: Data updated in one service but not reflected
   - **Expected**: Cache invalidation or real-time updates
   - **Assertions**: Data consistency maintained

5. **Service Unavailable**
   - **Scenario**: One feature service unavailable
   - **Expected**: Dashboard shows available data, error for unavailable
   - **Assertions**: Partial failure handling

### Dependencies
- Bill management service
- Expense management service
- Income tracking service
- Investment monitoring service
- Dashboard service
- PostgreSQL database
- MongoDB database
- Cache service (optional)

---

## Test Flow 2: Financial Health Metrics

### Test Scenario
Dashboard calculates financial health metrics including savings rate, expense-to-income ratio, bill payment rate, and investment growth.

### Prerequisites
- User has financial data across features
- Dashboard service running
- All feature services accessible

### Test Steps

1. **Get Financial Health Metrics**
   - **Action**: `GET /api/v1/dashboard/health-metrics?period=MONTH`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "savingsRate": 0.33,
       "expenseToIncomeRatio": 0.67,
       "billPaymentRate": 0.95,
       "investmentGrowth": 0.12,
       "cashFlow": 50000
     }
     ```
   - **Assertions**:
     - Savings rate = (income - expenses) / income
     - Expense to income ratio = expenses / income
     - Bill payment rate = (bills paid on time) / (total bills)
     - Investment growth = (current value - cost) / cost
     - Cash flow = income - expenses
     - All metrics calculated correctly

2. **Verify Savings Rate Calculation**
   - **Action**: Calculate manually and compare
   - **Calculation**: (150000 - 100000) / 150000 = 0.33
   - **Assertions**: Savings rate accurate

3. **Verify Expense-to-Income Ratio**
   - **Action**: Calculate manually and compare
   - **Calculation**: 100000 / 150000 = 0.67
   - **Assertions**: Ratio accurate

4. **Verify Bill Payment Rate**
   - **Action**: Check bill payment history
   - **Calculation**: (bills paid on time) / (total bills)
   - **Assertions**: Payment rate accurate

5. **Verify Investment Growth**
   - **Action**: Compare with investment service ROI
   - **Assertions**: Investment growth matches portfolio ROI

6. **Test Different Periods**
   - **Action**: Get metrics for WEEK, QUARTER, YEAR
   - **Expected**: Metrics calculated for each period
   - **Assertions**: Period filtering works

### Expected Results
- All health metrics calculated correctly
- Calculations match manual verification
- Period filtering works
- Metrics useful for financial insights

### Edge Cases

1. **Zero Income**
   - **Scenario**: User has expenses but no income
   - **Expected**: Savings rate negative or undefined
   - **Assertions**: Zero income handling

2. **Expenses Exceed Income**
   - **Scenario**: Expenses greater than income
   - **Expected**: Negative savings rate, expense ratio > 1
   - **Assertions**: Negative values handled

3. **No Bills**
   - **Scenario**: User has no bills
   - **Expected**: Bill payment rate undefined or 100%
   - **Assertions**: No bills handling

4. **No Investments**
   - **Scenario**: User has no investments
   - **Expected**: Investment growth undefined or zero
   - **Assertions**: No investments handling

### Dependencies
- Dashboard service
- All feature services
- Calculation service

---

## Test Flow 3: Trend Analysis

### Test Scenario
Dashboard provides trend data over time for income, expenses, savings, and investments.

### Prerequisites
- User has historical data across multiple periods
- Dashboard service running
- Time-series data available

### Test Steps

1. **Get Income Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=INCOME`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     [
       {"date": "2024-01-01", "value": 50000},
       {"date": "2024-02-01", "value": 50000},
       {"date": "2024-03-01", "value": 50000}
     ]
     ```
   - **Assertions**:
     - Trend data matches income entries
     - Monthly aggregation correct
     - Dates accurate

2. **Get Expense Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=EXPENSE`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Expense trends match expense entries
     - Monthly totals accurate
     - Trend visible over time

3. **Get Savings Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=SAVINGS`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Savings = income - expenses for each period
     - Trend shows savings over time
     - Calculations accurate

4. **Get Investment Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=INVESTMENT`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Investment trends match portfolio values
     - Monthly portfolio values accurate
     - Growth trend visible

5. **Verify Trend Accuracy**
   - **Action**: Compare trends with source data
   - **Assertions**:
     - Trend values match aggregated source data
     - No data points missing
     - Time periods correct

6. **Test Different Periods**
   - **Action**: Get trends for WEEK, QUARTER, YEAR
   - **Expected**: Trends aggregated for each period
   - **Assertions**: Period aggregation works

### Expected Results
- Trend data accurate for all metrics
- Trends match source data
- Period aggregation works
- Trends useful for analysis

### Edge Cases

1. **Insufficient Data**
   - **Scenario**: User has data for only one period
   - **Expected**: Single data point or empty array
   - **Assertions**: Insufficient data handling

2. **Gaps in Data**
   - **Scenario**: Missing data for some periods
   - **Expected**: Zero values or interpolation
   - **Assertions**: Gap handling

3. **Large Date Range**
   - **Scenario**: Trends for entire year
   - **Expected**: Performance acceptable, all data included
   - **Assertions**: Efficient aggregation

### Dependencies
- Dashboard service
- All feature services
- Time-series aggregation service

---

## Test Flow 4: Real-time Dashboard Updates

### Test Scenario
Dashboard updates in real-time when new transactions are added, with cache invalidation and data synchronization.

### Prerequisites
- User has existing dashboard data
- Dashboard service with caching (optional)
- All feature services running

### Test Steps

1. **Get Initial Dashboard**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Initial dashboard data
   - **Assertions**: Dashboard data returned

2. **Add New Expense**
   - **Action**: `POST /api/v1/expenses`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**: New expense
   - **Expected Response**: `201 Created`
   - **Assertions**: Expense created

3. **Verify Dashboard Update**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Total expenses increased
     - Net savings decreased
     - Expense distribution updated
     - Cache invalidated (if caching used)

4. **Add New Income**
   - **Action**: `POST /api/v1/incomes`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `201 Created`
   - **Assertions**: Income created

5. **Verify Dashboard Update Again**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Total income increased
     - Net savings updated
     - Income distribution updated

6. **Add New Bill**
   - **Action**: `POST /api/v1/bills`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `201 Created`
   - **Assertions**: Bill created

7. **Verify Upcoming Bills Updated**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Upcoming bills include new bill
     - Outstanding bills updated

8. **Add Investment Transaction**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/transactions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `201 Created`
   - **Assertions**: Transaction created

9. **Verify Investment Value Updated**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Investment value updated
     - Net worth recalculated

### Expected Results
- Dashboard updates when new data added
- Cache invalidation works (if caching)
- Data consistency maintained
- Updates reflected immediately
- All features trigger updates

### Edge Cases

1. **Concurrent Updates**
   - **Scenario**: Multiple transactions added simultaneously
   - **Expected**: All updates reflected correctly
   - **Assertions**: Concurrency handling

2. **Cache Invalidation Failure**
   - **Scenario**: Cache invalidation fails
   - **Expected**: Stale data or forced refresh
   - **Assertions**: Cache failure handling

3. **Service Unavailable During Update**
   - **Scenario**: Feature service unavailable when dashboard accessed
   - **Expected**: Partial data or error handling
   - **Assertions**: Service failure handling

### Dependencies
- Dashboard service
- All feature services
- Cache service (optional)
- Event system (optional)

---

## Test Flow 5: Cross-Feature Data Consistency

### Test Scenario
Data consistency is maintained across features, with proper synchronization between PostgreSQL and MongoDB, and accurate cross-feature calculations.

### Prerequisites
- User has data across all features
- Both PostgreSQL and MongoDB databases
- All services running

### Test Steps

1. **Create Cross-Feature Data**
   - **Action**: Create income, expense, bill, and investment
   - **Assertions**: Data stored in respective databases

2. **Verify Net Worth Calculation**
   - **Action**: Calculate net worth manually
   - **Calculation**: Investments (PostgreSQL) + Cash - Outstanding Bills (MongoDB)
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Assertions**:
     - Net worth calculation includes data from both databases
     - Calculation accurate
     - Data consistency maintained

3. **Verify Cash Flow Calculation**
   - **Action**: Calculate cash flow manually
   - **Calculation**: Income (MongoDB) - Expenses (MongoDB)
   - **Action**: `GET /api/v1/dashboard/health-metrics`
   - **Assertions**:
     - Cash flow calculated from MongoDB data
     - Calculation accurate

4. **Test Payment-Bill Synchronization**
   - **Action**: Create payment for bill
   - **Action**: Verify bill status updated
   - **Assertions**:
     - Payment (PostgreSQL) linked to bill (MongoDB)
     - Bill status synchronized
     - Data consistency maintained

5. **Test Investment-Dashboard Integration**
   - **Action**: Add investment transaction
   - **Action**: Verify dashboard investment value updated
   - **Assertions**:
     - Investment data (PostgreSQL) reflected in dashboard
     - Net worth updated
     - Data consistency maintained

6. **Verify Transaction Consistency**
   - **Action**: Perform operations that affect multiple databases
   - **Expected**: All databases updated consistently
   - **Assertions**: Transaction consistency maintained

### Expected Results
- Data consistent across databases
- Cross-feature calculations accurate
- Synchronization works correctly
- No data inconsistencies

### Edge Cases

1. **Database Transaction Failure**
   - **Scenario**: One database update succeeds, other fails
   - **Expected**: Rollback or compensation
   - **Assertions**: Transaction failure handling

2. **Data Sync Delay**
   - **Scenario**: Delay in data synchronization
   - **Expected**: Eventual consistency or real-time sync
   - **Assertions**: Sync delay handling

3. **Inconsistent Data States**
   - **Scenario**: Data in one database doesn't match other
   - **Expected**: Reconciliation or error detection
   - **Assertions**: Inconsistency detection

### Dependencies
- PostgreSQL database
- MongoDB database
- Transaction management
- Data synchronization service
- All feature services

---

## Test Flow 6: Complete Dashboard Lifecycle

### Test Scenario
End-to-end flow: Data creation across features → Dashboard aggregation → Health metrics → Trends → Real-time updates → Consistency verification.

### Prerequisites
- User with authentication
- All services running
- Complete test environment

### Test Steps

1. Create data across all features
2. Get dashboard summary
3. Verify data aggregation
4. Get health metrics
5. Get trends for all metrics
6. Add new transactions
7. Verify real-time updates
8. Verify data consistency

### Expected Results
- Complete dashboard lifecycle works seamlessly
- All aggregations accurate
- Real-time updates work
- Data consistency maintained
- Performance acceptable

### Edge Cases
- Service failures
- Data inconsistencies
- Cache issues
- Performance problems

### Dependencies
- All feature services
- Dashboard service
- Database services
- Cache service
- Synchronization services

