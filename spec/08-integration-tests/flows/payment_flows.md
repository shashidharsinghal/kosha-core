# Payment Integration Test Flows

This document defines integration test cases for payment flows, including UPI account linking, bill payment, autopay mandate creation, and payment status tracking.

## Test Flow 1: UPI Account Linking

### Test Scenario
User links their UPI account via OAuth to enable bill payments and autopay mandates.

### Prerequisites
- User is registered and authenticated
- Valid access token
- Mock UPI provider OAuth service configured
- PostgreSQL database (test instance)

### Test Steps

1. **Initiate UPI Account Linking**
   - **Action**: `POST /api/v1/payments/link-upi`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "provider": "Razorpay",
       "oauthCode": "mock_oauth_code_67890"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "id": "upi_account_123",
       "userId": "user_456",
       "provider": "Razorpay",
       "upiId": "user@paytm",
       "status": "ACTIVE",
       "linkedAt": "2024-02-01T00:00:00Z"
     }
     ```
   - **Assertions**:
     - OAuth code exchanged for tokens
     - UPI account created in PostgreSQL
     - Account status set to ACTIVE
     - Token stored securely (encrypted)
     - `linkedAt` timestamp set

2. **Verify UPI Account Storage**
   - **Action**: Query database directly
   - **Assertions**:
     - UPI account record exists in `upi_accounts` table
     - Token encrypted/securely stored
     - User ID matches authenticated user
     - Provider information stored

3. **List Linked UPI Accounts**
   - **Action**: `GET /api/v1/payments/accounts`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Array of UPI accounts
   - **Assertions**:
     - All linked accounts returned
     - Only user's accounts returned
     - Account status included

4. **Test UPI Account Access**
   - **Action**: Use linked account for payment
   - **Expected**: Payment can be initiated
   - **Assertions**: Account credentials work for payments

### Expected Results
- UPI account successfully linked
- Account stored securely
- Account listing works
- Account can be used for payments

### Edge Cases

1. **Invalid OAuth Code**
   - **Action**: Link with invalid/expired OAuth code
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Error message indicates invalid OAuth code

2. **OAuth Code Already Used**
   - **Action**: Attempt to use same OAuth code twice
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Error handling for reused codes

3. **Network Failure During OAuth Exchange**
   - **Action**: Simulate network failure
   - **Expected**: Retry logic or graceful error handling
   - **Assertions**: User receives appropriate error message

4. **Multiple UPI Accounts**
   - **Scenario**: User links multiple UPI accounts
   - **Expected**: All accounts stored and listed
   - **Assertions**: Multiple accounts supported

5. **Expired UPI Token**
   - **Scenario**: UPI provider token expired
   - **Expected**: Token refresh or re-linking required
   - **Assertions**: Token expiration handling

### Dependencies
- UPI provider OAuth service
- PostgreSQL database
- Token encryption service
- Authentication service

---

## Test Flow 2: Bill Payment via UPI

### Test Scenario
User initiates bill payment via linked UPI account, payment is processed, status is tracked, and bill is updated upon success.

### Prerequisites
- User is registered and authenticated
- Bill exists in MongoDB
- UPI account is linked
- Payment gateway service configured
- PostgreSQL database (for payments)
- MongoDB database (for bills)

### Test Steps

1. **Create Bill**
   - **Action**: Create bill with status PENDING
   - **Assertions**: Bill created successfully

2. **Initiate Bill Payment**
   - **Action**: `POST /api/v1/payments/pay-bill`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "billId": "bill_123",
       "paymentMethod": "UPI",
       "upiAccountId": "upi_account_456",
       "idempotencyKey": "unique_key_789"
     }
     ```
   - **Expected Response**: `202 Accepted`
   - **Response Body**:
     ```json
     {
       "id": "payment_abc",
       "billId": "bill_123",
       "amount": 5000,
       "status": "INITIATED",
       "method": "UPI",
       "transactionReference": "txn_ref_xyz",
       "initiatedAt": "2024-02-01T10:00:00Z"
     }
     ```
   - **Assertions**:
     - Payment record created in PostgreSQL
     - Payment linked to bill
     - Payment status is INITIATED
     - Transaction reference generated
     - Idempotency key prevents duplicates

3. **Poll Payment Status**
   - **Action**: `GET /api/v1/payments/{paymentId}/status`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Payment object with current status
   - **Assertions**:
     - Status updates correctly
     - Payment details returned

4. **Payment Gateway Callback/Webhook**
   - **Action**: Simulate payment gateway success callback
   - **Expected**: Payment status updated to SUCCESS
   - **Assertions**:
     - Payment record updated in PostgreSQL
     - Status changed to SUCCESS
     - `paidAt` timestamp set
     - Transaction reference stored

5. **Verify Bill Status Update**
   - **Action**: Bill service receives payment success notification
   - **Action**: `GET /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Bill with `status: "PAID"`
   - **Assertions**:
     - Bill status updated to PAID in MongoDB
     - Payment ID linked to bill
     - Bill `updatedAt` timestamp changed

6. **Verify Payment History**
   - **Action**: `GET /api/v1/payments?billId=bill_123`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Payment records for bill
   - **Assertions**:
     - Payment history includes successful payment
     - Payment linked to correct bill

### Expected Results
- Payment initiated successfully
- Payment status tracked correctly
- Bill status synchronized
- Payment history maintained
- Data consistency across databases

### Edge Cases

1. **Payment Failure - Insufficient Balance**
   - **Scenario**: Payment fails due to insufficient funds
   - **Expected**: Payment status FAILED, bill remains PENDING
   - **Assertions**:
     - Failure status set correctly
     - Error code and message stored
     - Bill not marked as paid
     - Failure notification sent

2. **Payment Timeout**
   - **Scenario**: Payment status unknown after timeout period
   - **Expected**: Status set to PENDING, manual verification required
   - **Assertions**:
     - Timeout handling works
     - User can retry or verify manually

3. **Duplicate Payment Prevention**
   - **Scenario**: Same payment attempted twice with same idempotency key
   - **Expected**: Second attempt returns existing payment
   - **Assertions**: Idempotency key prevents duplicate payments

4. **Bill Deleted During Payment**
   - **Scenario**: Bill deleted while payment in progress
   - **Expected**: Payment completes but bill link may be broken
   - **Assertions**: Error handling for orphaned payments

5. **Payment Gateway Unavailable**
   - **Scenario**: Payment gateway service down
   - **Expected**: Payment status INITIATED, retry logic
   - **Assertions**: Gateway failure handling

6. **Concurrent Payment Attempts**
   - **Scenario**: Multiple payment attempts for same bill
   - **Expected**: Only one payment succeeds or all fail appropriately
   - **Assertions**: Concurrency handling works

### Dependencies
- Payment gateway service
- UPI provider API
- Bill management service
- PostgreSQL database (payments)
- MongoDB database (bills)
- Notification service

---

## Test Flow 3: Autopay Mandate Creation and Management

### Test Scenario
User creates UPI autopay mandate for recurring bill, mandate is activated, payments execute automatically, and mandate can be managed (pause/resume/cancel).

### Prerequisites
- User is registered and authenticated
- Recurring bill exists in MongoDB
- UPI account is linked
- Payment gateway supports mandates
- PostgreSQL database
- Background job processor

### Test Steps

1. **Create Recurring Bill**
   - **Action**: Create bill with recurrence pattern
   - **Request Body**:
     ```json
     {
       "title": "Home Loan EMI",
       "amount": 25000,
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 5
       }
     }
     ```
   - **Assertions**: Recurring bill created

2. **Create Autopay Mandate**
   - **Action**: `POST /api/v1/payments/mandates`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "billId": "bill_123",
       "upiAccountId": "upi_account_456",
       "frequency": "MONTHLY"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**:
     ```json
     {
       "id": "mandate_789",
       "billId": "bill_123",
       "upiAccountId": "upi_account_456",
       "amount": 25000,
       "frequency": "MONTHLY",
       "nextDueDate": "2024-03-05T00:00:00Z",
       "status": "ACTIVE",
       "providerMandateId": "provider_mandate_abc"
     }
     ```
   - **Assertions**:
     - Mandate created in PostgreSQL
     - Mandate linked to bill and UPI account
     - Provider mandate ID stored
     - Status set to ACTIVE
     - Next due date calculated

3. **Verify Mandate in Provider System**
   - **Action**: Check with payment provider
   - **Assertions**:
     - Mandate registered with provider
     - Provider mandate ID matches

4. **List Active Mandates**
   - **Action**: `GET /api/v1/payments/mandates?status=ACTIVE`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Array of active mandates
   - **Assertions**:
     - All active mandates returned
     - Mandate details accurate

5. **Automatic Payment Execution**
   - **Action**: Background job runs on due date
   - **Expected**: Payment initiated automatically
   - **Assertions**:
     - Payment created for mandate
     - Payment linked to bill
     - Payment status tracked
     - Bill updated upon success

6. **Pause Mandate**
   - **Action**: `PUT /api/v1/payments/mandates/{mandateId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "status": "PAUSED"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated mandate with status PAUSED
   - **Assertions**:
     - Mandate status updated
     - Provider notified (if required)
     - Future payments paused

7. **Resume Mandate**
   - **Action**: `PUT /api/v1/payments/mandates/{mandateId}`
   - **Request Body**:
     ```json
     {
       "status": "ACTIVE"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Mandate status updated to ACTIVE
     - Future payments resume

8. **Cancel Mandate**
   - **Action**: `PUT /api/v1/payments/mandates/{mandateId}`
   - **Request Body**:
     ```json
     {
       "status": "CANCELLED"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Mandate status updated to CANCELLED
     - Provider mandate cancelled
     - No future payments executed

### Expected Results
- Mandate created successfully
- Mandate registered with provider
- Automatic payments execute correctly
- Mandate management works
- Bill payments processed automatically

### Edge Cases

1. **Mandate Creation Failure**
   - **Scenario**: Provider rejects mandate creation
   - **Expected**: Error returned, mandate not created
   - **Assertions**: Provider error handling

2. **Payment Failure in Mandate**
   - **Scenario**: Automatic payment fails
   - **Expected**: Payment status FAILED, notification sent
   - **Assertions**: Failure handling and notification

3. **Mandate Expiration**
   - **Scenario**: Mandate expires (if applicable)
   - **Expected**: Mandate status updated, renewal required
   - **Assertions**: Expiration handling

4. **Bill Amount Change**
   - **Scenario**: Recurring bill amount changes
   - **Expected**: Mandate updated or new mandate required
   - **Assertions**: Amount change handling

5. **Multiple Mandates for Same Bill**
   - **Scenario**: User creates multiple mandates
   - **Expected**: Only one active mandate or error
   - **Assertions**: Business rule enforcement

6. **Provider Mandate Cancellation**
   - **Scenario**: Mandate cancelled in provider system
   - **Expected**: System status synchronized
   - **Assertions**: Status sync with provider

### Dependencies
- Payment gateway service
- UPI provider API
- Bill management service
- PostgreSQL database
- Background job processor
- Notification service

---

## Test Flow 4: Payment Status Tracking and History

### Test Scenario
User views payment history, filters payments, tracks payment status, and receives payment confirmations.

### Prerequisites
- User has multiple payments
- Payment history exists
- PostgreSQL database with payment records

### Test Steps

1. **List Payment History**
   - **Action**: `GET /api/v1/payments?page=1&limit=20`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "payments": [...],
       "total": 50,
       "page": 1,
       "limit": 20
     }
     ```
   - **Assertions**:
     - Payments returned with pagination
     - Only user's payments returned
     - Payment details included

2. **Filter Payments by Status**
   - **Action**: `GET /api/v1/payments?status=SUCCESS`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Only successful payments returned
     - Filtering works correctly

3. **Filter Payments by Bill**
   - **Action**: `GET /api/v1/payments?billId=bill_123`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Only payments for specified bill returned
     - Bill filtering works

4. **Filter Payments by Date Range**
   - **Action**: `GET /api/v1/payments?startDate=2024-01-01&endDate=2024-03-31`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Only payments in date range returned
     - Date filtering works

5. **Get Payment Details**
   - **Action**: `GET /api/v1/payments/{paymentId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Complete payment object
   - **Assertions**:
     - All payment details returned
     - Status, amount, method, timestamps included
     - Transaction reference included

6. **Verify Payment Notifications**
   - **Action**: Check notification service
   - **Assertions**:
     - Payment success notifications sent
     - Payment failure notifications sent
     - Notification details accurate

### Expected Results
- Payment history accessible
- Filtering works correctly
- Payment details accurate
- Notifications delivered

### Edge Cases

1. **Empty Payment History**
   - **Scenario**: User has no payments
   - **Expected**: Empty array returned
   - **Assertions**: Handles empty data gracefully

2. **Large Payment History**
   - **Scenario**: User has hundreds of payments
   - **Expected**: Pagination works, performance acceptable
   - **Assertions**: Efficient querying and pagination

3. **Payment Status Inconsistency**
   - **Scenario**: Payment status differs from provider
   - **Expected**: Status sync or manual verification
   - **Assertions**: Status consistency handling

### Dependencies
- Payment service
- PostgreSQL database
- Notification service
- Authentication service

---

## Test Flow 5: Complete Payment Lifecycle

### Test Scenario
End-to-end flow: UPI linking → Bill payment → Mandate creation → Automatic payment → Status tracking → History viewing.

### Prerequisites
- User with authentication
- All services running
- Payment gateway configured
- Complete test environment

### Test Steps

1. Link UPI account
2. Create bill
3. Initiate bill payment
4. Verify payment success
5. Create autopay mandate
6. Verify automatic payment execution
7. View payment history
8. Manage mandate (pause/resume)

### Expected Results
- Complete payment lifecycle works seamlessly
- All integrations function correctly
- Data consistency maintained
- User experience is smooth

### Edge Cases
- Payment failures
- Mandate creation failures
- Status synchronization issues
- Gateway unavailability

### Dependencies
- All payment services
- Payment gateway
- Bill management
- Notification service
- Background jobs

