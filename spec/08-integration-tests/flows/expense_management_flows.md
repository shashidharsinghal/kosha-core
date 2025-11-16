# Expense Management Integration Test Flows

This document defines integration test cases for expense management flows, including expense logging, categorization, spending analysis, and budget alerts.

## Test Flow 1: Manual Expense Entry and Categorization

### Test Scenario
User manually adds expenses, categorizes them, updates expenses, lists expenses with filters, and deletes expenses.

### Prerequisites
- User is registered and authenticated
- MongoDB database (test instance)
- Valid access token

### Test Steps

1. **Add Expense**
   - **Action**: `POST /api/v1/expenses`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "description": "Lunch at restaurant",
       "category": "Food",
       "amount": 500,
       "spentAt": "2024-02-01T12:30:00Z",
       "paymentMethod": "UPI",
       "notes": "Team lunch"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: Created expense object with `id`, `userId`, timestamps
   - **Assertions**:
     - Expense created in MongoDB
     - `userId` matches authenticated user
     - All fields stored correctly
     - `source` defaults to "MANUAL"

2. **Update Expense**
   - **Action**: `PUT /api/v1/expenses/{expenseId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "amount": 600,
       "category": "Food & Dining"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated expense object
   - **Assertions**:
     - Expense updated in database
     - Updated fields reflect changes
     - Other fields unchanged

3. **List Expenses with Filters**
   - **Action**: `GET /api/v1/expenses?category=Food&startDate=2024-02-01&endDate=2024-02-28&page=1&limit=20`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "expenses": [...],
       "total": 15,
       "page": 1,
       "limit": 20
     }
     ```
   - **Assertions**:
     - Only expenses matching filters returned
     - Pagination works correctly
     - Date range filtering accurate
     - Category filtering works
     - Expenses belong to authenticated user

4. **List Expenses by Payment Method**
   - **Action**: `GET /api/v1/expenses?paymentMethod=UPI`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Only UPI expenses returned
     - Filtering by payment method works

5. **Delete Expense**
   - **Action**: `DELETE /api/v1/expenses/{expenseId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "success": true
     }
     ```
   - **Assertions**:
     - Expense deleted from database
     - Expense no longer appears in listings
     - Dashboard summaries updated (if cached)

### Expected Results
- Expense CRUD operations work correctly
- Filtering and pagination function properly
- User isolation is maintained
- Data integrity preserved

### Edge Cases

1. **Invalid Expense Data**
   - **Action**: Create expense with negative amount
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation errors returned

2. **Update Non-existent Expense**
   - **Action**: Update expense with invalid ID
   - **Expected Response**: `404 Not Found`
   - **Assertions**: Error handling for missing expenses

3. **Update Another User's Expense**
   - **Action**: Attempt to update expense belonging to different user
   - **Expected Response**: `403 Forbidden` or `404 Not Found`
   - **Assertions**: Authorization check works

4. **Invalid Date Range**
   - **Action**: List expenses with endDate before startDate
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Date validation works

5. **Large Amount Expenses**
   - **Action**: Create expense with very large amount
   - **Expected**: Handled correctly or validation error
   - **Assertions**: Amount validation or proper handling

### Dependencies
- MongoDB database
- Authentication service
- Authorization middleware

---

## Test Flow 2: Expense Import from External Sources

### Test Scenario
User triggers expense import from UPI transactions, system parses transactions, creates expense records, and handles duplicates.

### Prerequisites
- User is registered and authenticated
- UPI account is linked (for UPI import)
- Mock UPI transaction data available
- MongoDB database
- Background job processor

### Test Steps

1. **Trigger UPI Expense Import**
   - **Action**: `POST /api/v1/expenses/import`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "source": "UPI"
     }
     ```
   - **Expected Response**: `202 Accepted`
   - **Response Body**:
     ```json
     {
       "jobId": "import_job_456",
       "status": "processing"
     }
     ```
   - **Assertions**:
     - Import job is queued
     - Job ID returned for tracking

2. **Wait for Import Completion**
   - **Action**: Poll job status
   - **Action**: `GET /api/v1/expenses/import/status/{jobId}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "status": "completed",
       "imported": 20,
       "failed": 2
     }
     ```
   - **Assertions**:
     - Import job completes
     - Imported and failed counts accurate

3. **Verify Imported Expenses**
   - **Action**: `GET /api/v1/expenses?source=UPI`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of expenses with `source: "UPI"`
   - **Assertions**:
     - Expenses created in MongoDB
     - `source` field set to "UPI"
     - Amount, date, merchant extracted correctly
     - `userId` matches authenticated user
     - Duplicate transactions not imported twice

4. **Verify Transaction Parsing**
   - **Action**: Compare imported expenses with source transactions
   - **Assertions**:
     - Amount extracted correctly
     - Date/time parsed accurately
     - Merchant/description extracted
     - Payment method identified

5. **Verify Duplicate Detection**
   - **Action**: Trigger import again with same transactions
   - **Expected**: Duplicates not created or merged
   - **Assertions**:
     - Deduplication based on amount, date, merchant
     - No duplicate expenses in database

### Expected Results
- Expenses successfully imported from external sources
- Transaction data accurately parsed
- Duplicates handled correctly
- Import job tracking works

### Edge Cases

1. **Duplicate Transaction Detection**
   - **Scenario**: Same transaction imported multiple times
   - **Expected**: Duplicate expenses not created
   - **Assertions**: Deduplication logic works

2. **Malformed Transaction Data**
   - **Scenario**: Transaction with incomplete information
   - **Expected**: Expense created with available data or skipped
   - **Assertions**: Error handling for parsing failures

3. **Card Statement Import**
   - **Scenario**: Import from credit card statements
   - **Expected**: Expenses created from statement entries
   - **Assertions**: Statement parsing works correctly

4. **SMS Transaction Import**
   - **Scenario**: Import from SMS transaction notifications
   - **Expected**: Expenses created from SMS data
   - **Assertions**: SMS parsing and extraction works

5. **Import Failure Recovery**
   - **Scenario**: Partial import failure
   - **Expected**: Successful imports saved, failures logged
   - **Assertions**: Partial success handled gracefully

### Dependencies
- UPI/Card/SMS APIs
- MongoDB database
- Background job processor
- Transaction parsing service
- Authentication service

---

## Test Flow 3: Expense Analysis and Insights

### Test Scenario
System analyzes user expenses, generates category summaries, monthly trends, burn rate calculations, and integrates with dashboard.

### Prerequisites
- User has multiple expenses across categories
- Expenses span multiple months
- MongoDB database with expense history
- Dashboard service running

### Test Steps

1. **Create Expense History**
   - **Action**: Create expenses across multiple categories and months
   - **Example**: Food, Transport, Entertainment expenses over 3 months
   - **Assertions**: Expenses stored in database

2. **Get Expense Summary**
   - **Action**: `GET /api/v1/expenses/summary?startDate=2024-01-01&endDate=2024-03-31`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "total": 50000,
       "byCategory": {
         "Food": 20000,
         "Transport": 15000,
         "Entertainment": 10000,
         "Other": 5000
       },
       "byMonth": {
         "2024-01": 15000,
         "2024-02": 18000,
         "2024-03": 17000
       },
       "burnRate": 16666.67
     }
     ```
   - **Assertions**:
     - Total calculated correctly
     - Category breakdown accurate
     - Monthly totals correct
     - Burn rate calculated (average daily spending)

3. **Verify Category Breakdown**
   - **Action**: Compare summary with actual expenses
   - **Assertions**:
     - Category totals match sum of expenses
     - All categories included
     - Percentages calculated correctly

4. **Verify Monthly Trends**
   - **Action**: Compare monthly data with actual expenses
   - **Assertions**:
     - Monthly totals accurate
     - Trends visible in data
     - Date range filtering works

5. **Dashboard Integration**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Dashboard summary including expense data
   - **Assertions**:
     - Expense data included in dashboard
     - Expense distribution matches summary
     - Total expenses match
     - Data consistency across endpoints

6. **Verify Burn Rate Calculation**
   - **Action**: Calculate burn rate manually and compare
   - **Assertions**:
     - Burn rate = total / number of days in period
     - Calculation accurate
     - Useful for budget planning

### Expected Results
- Expense summaries accurately calculated
- Category and monthly breakdowns correct
- Burn rate useful for insights
- Dashboard integration works
- Data consistency maintained

### Edge Cases

1. **No Expenses in Period**
   - **Scenario**: User has no expenses in date range
   - **Expected**: Summary returns zeros or empty objects
   - **Assertions**: Handles empty data gracefully

2. **Single Category Expenses**
   - **Scenario**: All expenses in one category
   - **Expected**: Summary shows 100% in that category
   - **Assertions**: Single category handled correctly

3. **Large Date Range**
   - **Scenario**: Summary for entire year
   - **Expected**: Performance acceptable, all data included
   - **Assertions**: Efficient aggregation for large ranges

4. **Expense Deletion Impact**
   - **Scenario**: Expense deleted after summary generated
   - **Expected**: Summary updates or cache invalidated
   - **Assertions**: Data consistency maintained

5. **Concurrent Expense Addition**
   - **Scenario**: Expenses added while summary calculated
   - **Expected**: Summary reflects current state or uses snapshot
   - **Assertions**: Consistency or snapshot handling

### Dependencies
- MongoDB database
- Dashboard service
- Cache service (Redis, optional)
- Authentication service

---

## Test Flow 4: Budget Alerts and Spending Limits

### Test Scenario
User sets monthly spending limits, system tracks spending against limits, and sends alerts when limits are approached or exceeded.

### Prerequisites
- User is registered and authenticated
- Expenses exist for current month
- Budget/limit configuration available
- Notification service running

### Test Steps

1. **Set Monthly Budget Limits**
   - **Action**: `POST /api/v1/budgets` (if budget feature exists)
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "category": "Food",
       "monthlyLimit": 10000,
       "alertThreshold": 0.8
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**:
     - Budget limit stored
     - Alert threshold configured

2. **Track Spending Against Limit**
   - **Action**: Add expenses in category
   - **Action**: `GET /api/v1/expenses/summary?category=Food`
   - **Expected**: Current spending tracked
   - **Assertions**:
     - Spending calculated correctly
     - Limit comparison accurate

3. **Trigger Budget Alert**
   - **Scenario**: Spending reaches 80% of limit
   - **Expected**: Alert notification scheduled/sent
   - **Assertions**:
     - Alert triggered at threshold
     - Notification created with correct details
     - User receives alert

4. **Exceed Budget Limit**
   - **Scenario**: Spending exceeds limit
   - **Expected**: Exceeded alert sent
   - **Assertions**:
     - Exceeded status detected
     - Alert notification sent
     - Dashboard shows exceeded status

5. **Verify Dashboard Budget Display**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: Budget status included
   - **Assertions**:
     - Budget limits displayed
     - Current spending shown
     - Exceeded categories highlighted

### Expected Results
- Budget limits configured and stored
- Spending tracked accurately
- Alerts triggered at thresholds
- Notifications delivered
- Dashboard shows budget status

### Edge Cases

1. **Multiple Category Limits**
   - **Scenario**: User sets limits for multiple categories
   - **Expected**: All limits tracked independently
   - **Assertions**: Multiple budgets managed correctly

2. **Limit Change Mid-Month**
   - **Scenario**: User changes limit after spending started
   - **Expected**: New limit applies, alerts recalculated
   - **Assertions**: Limit updates handled

3. **Zero Spending**
   - **Scenario**: No expenses in category
   - **Expected**: Shows 0% of limit used
   - **Assertions**: Zero state handled

4. **Very High Spending**
   - **Scenario**: Spending far exceeds limit
   - **Expected**: Multiple alerts or single exceeded alert
   - **Assertions**: High spending handled

### Dependencies
- Expense management service
- Budget service (if separate)
- Notification service
- Dashboard service
- MongoDB database

---

## Test Flow 5: Complete Expense Management Lifecycle

### Test Scenario
End-to-end flow: Manual entry → Import → Categorization → Analysis → Budget alerts → Dashboard integration.

### Prerequisites
- User with authentication
- All services running
- Complete test environment

### Test Steps

1. Add manual expenses
2. Import expenses from UPI
3. Categorize and update expenses
4. Generate expense summary
5. Set budget limits
6. Track spending against limits
7. Receive budget alerts
8. View expense data in dashboard

### Expected Results
- Complete expense lifecycle works seamlessly
- All features integrate correctly
- Data consistency maintained
- User experience is smooth

### Edge Cases
- Import failures
- Categorization errors
- Budget calculation issues
- Dashboard sync problems

### Dependencies
- All expense management services
- Import services
- Budget service
- Notification service
- Dashboard service

