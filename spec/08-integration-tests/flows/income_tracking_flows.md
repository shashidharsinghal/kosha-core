# Income Tracking Integration Test Flows

This document defines integration test cases for income tracking flows, including income entry, categorization, payroll integration from Gmail, and dashboard integration.

## Test Flow 1: Income Entry and Categorization

### Test Scenario
User manually adds income entries, categorizes them by source, updates income records, lists incomes, and generates income summaries.

### Prerequisites
- User is registered and authenticated
- MongoDB database (test instance)
- Valid access token

### Test Steps

1. **Add Income Entry**
   - **Action**: `POST /api/v1/incomes`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "source": "Salary",
       "amount": 50000,
       "receivedAt": "2024-02-01T00:00:00Z",
       "category": "Employment",
       "notes": "Monthly salary from employer"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: Created income object with `id`, `userId`, timestamps
   - **Assertions**:
     - Income created in MongoDB
     - `userId` matches authenticated user
     - All fields stored correctly
     - `importSource` defaults to "MANUAL"

2. **Add Multiple Income Sources**
   - **Action**: Add income entries for different sources
   - **Examples**: Salary, Freelance, Interest, Dividends
   - **Assertions**: All income entries created successfully

3. **Update Income Entry**
   - **Action**: `PUT /api/v1/incomes/{incomeId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "amount": 52000,
       "notes": "Salary with bonus"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated income object
   - **Assertions**:
     - Income updated in database
     - Updated fields reflect changes
     - Other fields unchanged

4. **List Incomes with Filters**
   - **Action**: `GET /api/v1/incomes?category=Employment&startDate=2024-01-01&endDate=2024-03-31&page=1&limit=20`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "incomes": [...],
       "total": 3,
       "page": 1,
       "limit": 20
     }
     ```
   - **Assertions**:
     - Only incomes matching filters returned
     - Pagination works correctly
     - Date range filtering accurate
     - Category filtering works
     - Incomes belong to authenticated user

5. **Get Income Summary**
   - **Action**: `GET /api/v1/incomes/summary?startDate=2024-01-01&endDate=2024-03-31`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "total": 150000,
       "byCategory": {
         "Employment": 100000,
         "Freelance": 30000,
         "Interest": 20000
       },
       "byMonth": {
         "2024-01": 50000,
         "2024-02": 50000,
         "2024-03": 50000
       }
     }
     ```
   - **Assertions**:
     - Total calculated correctly
     - Category breakdown accurate
     - Monthly totals correct
     - Summary matches actual income entries

6. **Delete Income Entry**
   - **Action**: `DELETE /api/v1/incomes/{incomeId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "success": true
     }
     ```
   - **Assertions**:
     - Income deleted from database
     - Income no longer appears in listings
     - Dashboard summaries updated (if cached)

### Expected Results
- Income CRUD operations work correctly
- Filtering and pagination function properly
- Summary calculations are accurate
- User isolation is maintained

### Edge Cases

1. **Invalid Income Data**
   - **Action**: Create income with negative amount
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation errors returned

2. **Update Non-existent Income**
   - **Action**: Update income with invalid ID
   - **Expected Response**: `404 Not Found`
   - **Assertions**: Error handling for missing incomes

3. **Update Another User's Income**
   - **Action**: Attempt to update income belonging to different user
   - **Expected Response**: `403 Forbidden` or `404 Not Found`
   - **Assertions**: Authorization check works

4. **Invalid Date Range**
   - **Action**: List incomes with endDate before startDate
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Date validation works

5. **Recurring Income Configuration**
   - **Action**: Create income with recurrence pattern
   - **Request Body**:
     ```json
     {
       "source": "Salary",
       "amount": 50000,
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 1
       }
     }
     ```
   - **Expected**: Recurring income stored with recurrence metadata
   - **Assertions**: Recurrence pattern stored correctly

### Dependencies
- MongoDB database
- Authentication service
- Authorization middleware

---

## Test Flow 2: Payroll Import from Gmail

### Test Scenario
User with linked Gmail account triggers salary slip import, system fetches payroll emails, parses salary information, and creates income records.

### Prerequisites
- User is registered and authenticated
- Gmail account is linked (refresh token stored)
- Mock Gmail API with test emails containing salary slips
- MongoDB database
- Background job processor running

### Test Steps

1. **Trigger Income Import from Gmail**
   - **Action**: `POST /api/v1/incomes/import`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**: (empty or optional parameters)
   - **Expected Response**: `202 Accepted` (async operation)
   - **Response Body**:
     ```json
     {
       "jobId": "import_job_789",
       "status": "processing"
     }
     ```
   - **Assertions**:
     - Import job is queued
     - Job ID returned for tracking

2. **Wait for Import Completion**
   - **Action**: Poll job status
   - **Action**: `GET /api/v1/incomes/import/status/{jobId}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "status": "completed",
       "imported": 3,
       "failed": 0
     }
     ```
   - **Assertions**:
     - Import job completes successfully
     - Correct number of incomes imported

3. **Verify Imported Income Records**
   - **Action**: `GET /api/v1/incomes?importSource=GMAIL`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of incomes with `importSource: "GMAIL"`
   - **Assertions**:
     - Incomes created in MongoDB
     - Income fields correctly parsed (amount, date, source)
     - `importSource` field set to "GMAIL"
     - `userId` matches authenticated user
     - Incomes have proper timestamps

4. **Verify Salary Slip Parsing Accuracy**
   - **Action**: Compare imported incomes with source emails
   - **Assertions**:
     - Amount extracted correctly from salary slip
     - Date parsed accurately (salary credit date)
     - Source identified as "Salary"
     - Category set appropriately
     - Duplicate salary slips not imported twice

5. **Verify Duplicate Detection**
   - **Action**: Trigger import again with same emails
   - **Expected**: Duplicates not created
   - **Assertions**:
     - Deduplication based on amount, date, source
     - No duplicate income records

### Expected Results
- Income successfully imported from Gmail
- Salary slip data accurately parsed
- Duplicate detection works
- Import job tracking functions

### Edge Cases

1. **Duplicate Salary Slip**
   - **Scenario**: Same salary slip email imported twice
   - **Expected**: Duplicate income not created
   - **Assertions**: Deduplication logic works

2. **Malformed Salary Slip Email**
   - **Scenario**: Email with incomplete salary information
   - **Expected**: Income creation fails gracefully or creates with partial data
   - **Assertions**: Error handling for parsing failures

3. **Variable Salary Amounts**
   - **Scenario**: Salary varies month to month (bonuses, deductions)
   - **Expected**: All variations imported correctly
   - **Assertions**: Variable amounts handled

4. **Multiple Income Sources in Emails**
   - **Scenario**: Emails contain multiple income types
   - **Expected**: All income types extracted
   - **Assertions**: Multiple source parsing works

5. **Expired Gmail Token**
   - **Scenario**: Gmail refresh token expired
   - **Expected**: Error notification, token refresh attempt
   - **Assertions**: Token refresh or user notification

### Dependencies
- Gmail API
- MongoDB database
- Background job processor
- Email parsing/NLP service
- Authentication service

---

## Test Flow 3: Income-Dashboard Integration

### Test Scenario
Income entries are aggregated into dashboard summaries, financial health metrics are calculated, and income-expense comparisons are displayed.

### Prerequisites
- User has income entries
- User has expense entries
- Dashboard service running
- MongoDB database with income and expense data

### Test Steps

1. **Create Income and Expense Data**
   - **Action**: Create multiple income and expense entries
   - **Assertions**: Data stored in database

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
       "incomeDistribution": {
         "Salary": 100000,
         "Freelance": 30000,
         "Interest": 20000
       },
       "expenseDistribution": {...},
       "netWorth": 200000,
       "investmentValue": 150000,
       "outstandingBills": 25000
     }
     ```
   - **Assertions**:
     - Total income calculated correctly
     - Income distribution matches income summary
     - Net savings = total income - total expenses
     - All income sources included

3. **Get Financial Health Metrics**
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
     - Cash flow = income - expenses
     - All metrics calculated correctly

4. **Verify Income-Expense Comparison**
   - **Action**: Compare dashboard data with individual summaries
   - **Assertions**:
     - Income totals match income summary
     - Expense totals match expense summary
     - Net savings calculation accurate
     - Data consistency across services

5. **Get Income Trends**
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
     - Trends visible over time

6. **Verify Real-time Updates**
   - **Action**: Add new income entry
   - **Action**: Refresh dashboard summary
   - **Expected**: Dashboard reflects new income
   - **Assertions**:
     - Cache invalidation works (if caching used)
     - Dashboard updates with new data
     - Data consistency maintained

### Expected Results
- Income data accurately aggregated in dashboard
- Financial health metrics calculated correctly
- Income-expense comparisons accurate
- Trends display correctly
- Real-time updates work

### Edge Cases

1. **No Income Data**
   - **Scenario**: User has no income entries
   - **Expected**: Dashboard shows zero income
   - **Assertions**: Handles empty data gracefully

2. **Income Without Expenses**
   - **Scenario**: User has income but no expenses
   - **Expected**: Savings rate = 100%, expense ratio = 0
   - **Assertions**: Calculations handle zero expenses

3. **Expenses Exceed Income**
   - **Scenario**: Expenses greater than income
   - **Expected**: Negative savings, expense ratio > 1
   - **Assertions**: Negative values handled correctly

4. **Multiple Income Sources**
   - **Scenario**: User has many different income sources
   - **Expected**: All sources included in distribution
   - **Assertions**: Multiple sources aggregated correctly

5. **Income Deletion Impact**
   - **Scenario**: Income deleted after dashboard generated
   - **Expected**: Dashboard updates or cache invalidated
   - **Assertions**: Data consistency maintained

### Dependencies
- Income tracking service
- Expense management service
- Dashboard service
- MongoDB database
- Cache service (optional)

---

## Test Flow 4: Recurring Income Management

### Test Scenario
User creates recurring income entries, system tracks recurring patterns, and optionally auto-generates future income entries.

### Prerequisites
- User is registered and authenticated
- MongoDB database
- Background job processor (for auto-generation)

### Test Steps

1. **Create Recurring Income**
   - **Action**: `POST /api/v1/incomes`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "source": "Salary",
       "amount": 50000,
       "receivedAt": "2024-02-01T00:00:00Z",
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 1
       }
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**:
     - Income created with recurrence metadata
     - Recurrence pattern stored correctly

2. **Verify Recurrence Pattern**
   - **Action**: `GET /api/v1/incomes/{incomeId}`
   - **Expected**: Income includes recurrence object
   - **Assertions**:
     - Recurrence frequency stored
     - Day of month stored
     - Pattern can be used for auto-generation

3. **Auto-Generate Future Income (if implemented)**
   - **Action**: Background job runs monthly
   - **Expected**: New income entry created based on recurrence
   - **Assertions**:
     - Income created on correct date
     - Amount matches recurring pattern
     - Source and category match original

4. **Update Recurring Income**
   - **Action**: `PUT /api/v1/incomes/{incomeId}`
   - **Request Body**:
     ```json
     {
       "amount": 52000,
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 5
       }
     }
     ```
   - **Expected**: Income and recurrence updated
   - **Assertions**:
     - Recurrence pattern updated
     - Future auto-generations use new pattern

### Expected Results
- Recurring income entries created successfully
- Recurrence patterns stored correctly
- Auto-generation works (if implemented)
- Updates to recurring income handled

### Edge Cases

1. **Variable Recurring Amounts**
   - **Scenario**: Salary varies month to month
   - **Expected**: Auto-generation uses average or last amount
   - **Assertions**: Variable amounts handled

2. **Recurrence Pattern Changes**
   - **Scenario**: User changes frequency or day
   - **Expected**: New pattern applies to future entries
   - **Assertions**: Pattern updates handled

3. **Disable Recurrence**
   - **Scenario**: User removes recurrence from income
   - **Expected**: Recurrence removed, no future auto-generation
   - **Assertions**: Recurrence removal works

### Dependencies
- Income tracking service
- Background job processor
- MongoDB database

---

## Test Flow 5: Complete Income Tracking Lifecycle

### Test Scenario
End-to-end flow: Manual entry → Gmail import → Categorization → Summary → Dashboard integration → Recurring management.

### Prerequisites
- User with authentication
- Gmail linked
- All services running
- Complete test environment

### Test Steps

1. Add manual income entries
2. Import income from Gmail (salary slips)
3. Categorize and update income
4. Generate income summary
5. View income in dashboard
6. Create recurring income
7. Verify financial health metrics

### Expected Results
- Complete income lifecycle works seamlessly
- All features integrate correctly
- Data consistency maintained
- Dashboard reflects income accurately

### Edge Cases
- Import failures
- Parsing errors
- Dashboard sync issues
- Recurrence generation problems

### Dependencies
- All income tracking services
- Gmail import service
- Dashboard service
- Background jobs

