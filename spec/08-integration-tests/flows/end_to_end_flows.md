# End-to-End Integration Test Flows

This document defines complete user journey test cases that span multiple features, validating the entire system works together seamlessly.

## Test Flow 1: Complete Onboarding and First Bill Payment

### Test Scenario
New user registers, links Gmail, imports bills, links UPI account, pays first bill, and receives confirmation - complete onboarding journey.

### Prerequisites
- Clean test environment
- Mock Gmail API with test emails
- Mock UPI payment gateway
- All services running

### Test Steps

1. **User Registration**
   - **Action**: `POST /api/v1/auth/register`
   - **Request Body**:
     ```json
     {
       "email": "newuser@example.com",
       "password": "SecurePassword123!",
       "name": "New User"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**: User created successfully

2. **User Login**
   - **Action**: `POST /api/v1/auth/login`
   - **Request Body**:
     ```json
     {
       "email": "newuser@example.com",
       "password": "SecurePassword123!"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Access token and refresh token
   - **Assertions**: Login successful, tokens received

3. **Link Gmail Account**
   - **Action**: `POST /api/v1/auth/link-gmail`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "oauthCode": "mock_oauth_code"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**: Gmail linked successfully

4. **Import Bills from Gmail**
   - **Action**: `POST /api/v1/bills/import/gmail`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `202 Accepted`
   - **Assertions**: Import job started

5. **Wait for Import Completion**
   - **Action**: Poll import status
   - **Expected**: Import completed, bills created
   - **Assertions**: Bills imported successfully

6. **View Imported Bills**
   - **Action**: `GET /api/v1/bills`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of imported bills
   - **Assertions**: Bills visible in list

7. **Link UPI Account**
   - **Action**: `POST /api/v1/payments/link-upi`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "provider": "Razorpay",
       "oauthCode": "mock_upi_oauth_code"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**: UPI account linked

8. **Select Bill for Payment**
   - **Action**: `GET /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Bill details retrieved

9. **Initiate Bill Payment**
   - **Action**: `POST /api/v1/payments/pay-bill`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "billId": "{billId}",
       "paymentMethod": "UPI",
       "upiAccountId": "{upiAccountId}"
     }
     ```
   - **Expected Response**: `202 Accepted`
   - **Assertions**: Payment initiated

10. **Verify Payment Success**
    - **Action**: Poll payment status
    - **Expected**: Payment status SUCCESS
    - **Assertions**: Payment completed successfully

11. **Verify Bill Status Update**
    - **Action**: `GET /api/v1/bills/{billId}`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Expected Response**: `200 OK`
    - **Response Body**: Bill with status PAID
    - **Assertions**: Bill marked as paid

12. **Verify Payment Notification**
    - **Action**: Check notifications
    - **Expected**: Payment success notification sent
    - **Assertions**: Notification delivered

13. **View Dashboard**
    - **Action**: `GET /api/v1/dashboard/summary`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Expected Response**: `200 OK`
    - **Assertions**:
      - Dashboard shows bills
      - Payment reflected
      - Financial summary accurate

### Expected Results
- Complete onboarding flow works seamlessly
- All integrations function correctly
- User can complete first bill payment
- Notifications delivered
- Dashboard reflects all data

### Edge Cases
- Gmail import failures
- UPI linking failures
- Payment failures
- Notification delivery failures

### Dependencies
- Authentication service
- Gmail API
- Bill management service
- Payment service
- Notification service
- Dashboard service

---

## Test Flow 2: Monthly Financial Management Flow

### Test Scenario
User manages complete monthly financial cycle: income entry → expense tracking → bill management → investment monitoring → dashboard review → payment execution.

### Prerequisites
- User is registered and authenticated
- All services running
- Complete test environment

### Test Steps

1. **Add Monthly Income**
   - **Action**: `POST /api/v1/incomes`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "source": "Salary",
       "amount": 50000,
       "receivedAt": "2024-02-01T00:00:00Z",
       "category": "Employment"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**: Income recorded

2. **Track Daily Expenses**
   - **Action**: Add multiple expenses throughout month
   - **Examples**: Food, transport, entertainment
   - **Assertions**: Expenses recorded

3. **Import Expenses from UPI**
   - **Action**: `POST /api/v1/expenses/import`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "source": "UPI"
     }
     ```
   - **Expected Response**: `202 Accepted`
   - **Assertions**: Expenses imported

4. **Manage Bills**
   - **Action**: View upcoming bills
   - **Action**: `GET /api/v1/bills/upcoming?days=30`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Upcoming bills listed

5. **Review Expense Summary**
   - **Action**: `GET /api/v1/expenses/summary?startDate=2024-02-01&endDate=2024-02-28`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Expense summary accurate

6. **Monitor Investments**
   - **Action**: `GET /api/v1/investments/portfolio-summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Portfolio summary accurate

7. **Review Dashboard**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
      - Total income displayed
      - Total expenses displayed
      - Net savings calculated
      - Upcoming bills shown
      - Investment value included
      - Net worth calculated

8. **Get Financial Health Metrics**
   - **Action**: `GET /api/v1/dashboard/health-metrics?period=MONTH`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Savings rate calculated
     - Expense-to-income ratio calculated
     - Bill payment rate calculated
     - Investment growth calculated

9. **Pay Bills**
   - **Action**: Pay multiple bills
   - **Action**: `POST /api/v1/payments/pay-bill` for each bill
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `202 Accepted` for each
   - **Assertions**: Payments initiated

10. **Verify Payments Completed**
    - **Action**: Check payment statuses
    - **Expected**: All payments successful
    - **Assertions**: Payments completed

11. **Verify Dashboard Updates**
    - **Action**: `GET /api/v1/dashboard/summary`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Expected Response**: `200 OK`
    - **Assertions**:
      - Outstanding bills updated
      - Payment history reflected
      - Financial summary updated

12. **Receive Monthly Summary**
    - **Action**: Wait for monthly summary notification
    - **Expected**: Summary notification sent
    - **Assertions**: Summary includes all monthly data

### Expected Results
- Complete monthly cycle works seamlessly
- All features integrate correctly
- Data consistency maintained
- Dashboard reflects all activities
- Notifications delivered

### Edge Cases
- Missing income entry
- Expense import failures
- Bill payment failures
- Dashboard sync issues

### Dependencies
- All feature services
- Dashboard service
- Notification service
- Payment service

---

## Test Flow 3: Recurring Bill Autopay Flow

### Test Scenario
User sets up recurring bill with autopay mandate, system automatically pays bill monthly, sends confirmations, and manages mandate lifecycle.

### Prerequisites
- User is registered and authenticated
- UPI account linked
- Recurring bill exists
- Payment gateway supports mandates
- Background job processor running

### Test Steps

1. **Create Recurring Bill**
   - **Action**: `POST /api/v1/bills`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "title": "Home Loan EMI",
       "type": "LOAN",
       "provider": "HDFC Bank",
       "amount": 25000,
       "dueDate": "2024-02-05T00:00:00Z",
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 5
       }
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**: Recurring bill created

2. **Verify Recurring Detection**
   - **Action**: `GET /api/v1/bills/recurring-suggestions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Recurring pattern detected

3. **Create Autopay Mandate**
   - **Action**: `POST /api/v1/payments/mandates`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "billId": "{billId}",
       "upiAccountId": "{upiAccountId}",
       "frequency": "MONTHLY"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**: Mandate created

4. **Verify Mandate Active**
   - **Action**: `GET /api/v1/payments/mandates?status=ACTIVE`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Mandate listed as active

5. **Simulate Monthly Payment (Background Job)**
   - **Action**: Background job runs on due date
   - **Expected**: Payment initiated automatically
   - **Assertions**:
     - Payment created for mandate
     - Payment linked to bill
     - Payment status INITIATED

6. **Verify Payment Processing**
   - **Action**: Payment gateway processes payment
   - **Expected**: Payment status SUCCESS
   - **Assertions**: Payment completed

7. **Verify Bill Status Update**
   - **Action**: `GET /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Bill with status PAID
   - **Assertions**: Bill marked as paid

8. **Verify Payment Notification**
   - **Action**: Check notifications
   - **Expected**: Payment success notification sent
   - **Assertions**: Notification delivered

9. **Verify Next Bill Created**
   - **Action**: Background job creates next month's bill
   - **Expected**: New bill created for next month
   - **Assertions**: Recurring bill auto-created

10. **Verify Next Payment Scheduled**
    - **Action**: Check mandate next due date
    - **Expected**: Next payment scheduled
    - **Assertions**: Mandate continues for next month

11. **Pause Mandate**
    - **Action**: `PUT /api/v1/payments/mandates/{mandateId}`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Request Body**:
      ```json
      {
        "status": "PAUSED"
      }
      ```
    - **Expected Response**: `200 OK`
    - **Assertions**: Mandate paused

12. **Verify Payment Not Executed**
    - **Action**: Wait for next due date
    - **Expected**: Payment not executed
    - **Assertions**: Paused mandate respected

13. **Resume Mandate**
    - **Action**: `PUT /api/v1/payments/mandates/{mandateId}`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Request Body**:
      ```json
      {
        "status": "ACTIVE"
      }
      ```
    - **Expected Response**: `200 OK`
    - **Assertions**: Mandate resumed

14. **Verify Payment Resumes**
    - **Action**: Wait for next due date
    - **Expected**: Payment executed
    - **Assertions**: Resumed mandate works

### Expected Results
- Recurring bill detection works
- Autopay mandate created successfully
- Automatic payments execute correctly
- Bill status updates automatically
- Notifications delivered
- Mandate management works
- Next bills auto-created

### Edge Cases
- Payment failure in mandate
- Mandate creation failure
- Bill amount change
- Mandate expiration
- Provider mandate cancellation

### Dependencies
- Bill management service
- Payment service
- Background job processor
- Notification service
- Payment gateway

---

## Test Flow 4: Complete Investment Tracking and Portfolio Management

### Test Scenario
User adds investments, records transactions, tracks prices, monitors portfolio, views in dashboard, and receives investment insights.

### Prerequisites
- User is registered and authenticated
- Market data API configured
- All services running

### Test Steps

1. **Add Investment Assets**
   - **Action**: Add multiple assets (stocks, mutual funds)
   - **Action**: `POST /api/v1/investments/assets`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Assertions**: Assets created

2. **Record Buy Transactions**
   - **Action**: Add buy transactions for each asset
   - **Action**: `POST /api/v1/investments/assets/{assetId}/transactions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Assertions**: Transactions recorded

3. **Fetch Live Prices**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/fetch-price`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Prices fetched

4. **Calculate Portfolio Value**
   - **Action**: `GET /api/v1/investments/portfolio-summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Total value calculated
     - Total cost calculated
     - ROI calculated
     - Asset breakdown accurate

5. **View Investment in Dashboard**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Investment value included
     - Net worth includes investments
     - Investment data accurate

6. **Get Investment Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=INVESTMENT`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Investment trends displayed

7. **Record Sell Transaction**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/transactions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "transactionType": "SELL",
       "units": 5,
       "pricePerUnit": 2600
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**: Sell transaction recorded

8. **Verify Portfolio Updated**
   - **Action**: `GET /api/v1/investments/portfolio-summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Holdings updated
     - Portfolio value recalculated
     - ROI updated

9. **Get Price History**
   - **Action**: `GET /api/v1/investments/assets/{assetId}/price-history`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**: Price history displayed

10. **Verify Dashboard Updates**
    - **Action**: `GET /api/v1/dashboard/summary`
    - **Headers**: `Authorization: Bearer {accessToken}`
    - **Expected Response**: `200 OK`
    - **Assertions**: Dashboard reflects updated portfolio

### Expected Results
- Complete investment lifecycle works
- Portfolio calculations accurate
- Price tracking functions
- Dashboard integration works
- Data consistency maintained

### Edge Cases
- Price fetch failures
- Transaction validation errors
- Portfolio calculation issues
- Dashboard sync problems

### Dependencies
- Investment monitoring service
- Market data APIs
- Dashboard service
- Background jobs

---

## Test Flow 5: Data Consistency and Error Recovery

### Test Scenario
System maintains data consistency across features and databases, handles errors gracefully, and recovers from failures.

### Prerequisites
- User has data across all features
- All services running
- Error scenarios can be simulated

### Test Steps

1. **Create Cross-Feature Data**
   - **Action**: Create bills, expenses, income, investments
   - **Assertions**: Data created in respective databases

2. **Verify Initial Consistency**
   - **Action**: Check data across services
   - **Assertions**: Data consistent

3. **Simulate Service Failure**
   - **Action**: Stop one service (e.g., expense service)
   - **Expected**: Other services continue working
   - **Assertions**: Partial failure handling

4. **Verify Error Handling**
   - **Action**: Attempt operation requiring failed service
   - **Expected**: Graceful error or fallback
   - **Assertions**: Error handling works

5. **Recover Service**
   - **Action**: Restart failed service
   - **Expected**: Service recovers
   - **Assertions**: Service recovery works

6. **Verify Data Consistency After Recovery**
   - **Action**: Check data across services
   - **Assertions**: Data still consistent

7. **Test Transaction Rollback**
   - **Action**: Simulate transaction failure
   - **Expected**: Rollback or compensation
   - **Assertions**: Transaction handling works

8. **Verify Error Notifications**
   - **Action**: Check notifications
   - **Expected**: Error notifications sent
   - **Assertions**: User informed of errors

### Expected Results
- System handles failures gracefully
- Data consistency maintained
- Services recover correctly
- Error notifications sent
- User experience not severely impacted

### Edge Cases
- Multiple service failures
- Database connection failures
- Network interruptions
- Data corruption scenarios

### Dependencies
- All services
- Error handling mechanisms
- Transaction management
- Notification service
- Monitoring service

---

## Test Flow 6: Performance and Scalability

### Test Scenario
System handles large datasets, concurrent operations, and maintains performance under load.

### Prerequisites
- User with large dataset
- Performance testing tools
- All services running

### Test Steps

1. **Create Large Dataset**
   - **Action**: Create hundreds of bills, expenses, income entries
   - **Assertions**: Data created successfully

2. **Test Dashboard Performance**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected**: Response within acceptable time
   - **Assertions**: Performance acceptable

3. **Test Concurrent Operations**
   - **Action**: Multiple users perform operations simultaneously
   - **Expected**: All operations succeed
   - **Assertions**: Concurrency handling works

4. **Test Pagination**
   - **Action**: List bills/expenses with pagination
   - **Expected**: Pagination works correctly
   - **Assertions**: Large result sets handled

5. **Test Cache Performance**
   - **Action**: Repeated dashboard requests
   - **Expected**: Cached responses faster
   - **Assertions**: Caching improves performance

6. **Test Database Query Performance**
   - **Action**: Complex queries with filters
   - **Expected**: Queries optimized
   - **Assertions**: Database performance acceptable

### Expected Results
- System handles large datasets
- Performance acceptable
- Concurrency works correctly
- Scalability maintained

### Edge Cases
- Very large datasets
- High concurrency
- Slow database queries
- Cache misses

### Dependencies
- All services
- Database optimization
- Cache service
- Load balancing
- Performance monitoring

