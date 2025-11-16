# Bill Management Integration Test Flows

This document defines integration test cases for bill management flows, including bill creation, auto-import from Gmail, recurring bill detection, and payment tracking.

## Test Flow 1: Bill Auto-Import from Gmail

### Test Scenario
A user with linked Gmail account triggers bill import, system fetches emails, parses bill information, creates bill records, and handles duplicates.

### Prerequisites
- User is registered and authenticated
- Gmail account is linked (refresh token stored)
- Mock Gmail API with test emails containing bill information
- MongoDB database (test instance)
- Background job processor running

### Test Steps

1. **Trigger Gmail Bill Import**
   - **Action**: `POST /api/v1/bills/import/gmail`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**: (empty or optional parameters)
   - **Expected Response**: `202 Accepted` (async operation)
   - **Response Body**:
     ```json
     {
       "jobId": "import_job_123",
       "status": "processing"
     }
     ```
   - **Assertions**:
     - Import job is queued
     - Job ID is returned for tracking

2. **Wait for Import Completion**
   - **Action**: Poll job status or wait for webhook
   - **Action**: `GET /api/v1/bills/import/status/{jobId}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "status": "completed",
       "imported": 5,
       "failed": 0
     }
     ```
   - **Assertions**:
     - Import job completes successfully
     - Correct number of bills imported

3. **Verify Imported Bills**
   - **Action**: `GET /api/v1/bills?source=GMAIL`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of bills with `source: "GMAIL"`
   - **Assertions**:
     - Bills are created in MongoDB
     - Bill fields are correctly parsed (amount, due date, provider, type)
     - `source` field is set to "GMAIL"
     - `userId` matches authenticated user
     - Bills have proper timestamps

4. **Verify Email Parsing Accuracy**
   - **Action**: Compare imported bills with source emails
   - **Assertions**:
     - Amount extracted correctly
     - Due date parsed accurately
     - Provider/merchant identified
     - Bill type categorized correctly (LOAN, SUBSCRIPTION, UTILITY, etc.)

### Expected Results
- Bills successfully imported from Gmail
- Bill data accurately parsed and stored
- Import job tracking works
- Bills are associated with correct user

### Edge Cases

1. **Duplicate Bill Detection**
   - **Scenario**: Same bill email imported twice
   - **Action**: Trigger import again with same emails
   - **Expected**: Duplicate bills are not created or merged
   - **Assertions**: Deduplication logic works (based on amount, provider, due date)

2. **Malformed Email Content**
   - **Scenario**: Email with incomplete bill information
   - **Expected**: Bill creation fails gracefully or creates with partial data
   - **Assertions**: Error handling for parsing failures

3. **Gmail API Rate Limiting**
   - **Scenario**: Too many API requests
   - **Expected**: Rate limit handling, retry logic
   - **Assertions**: System handles rate limits gracefully

4. **Expired Gmail Token**
   - **Scenario**: Gmail refresh token expired
   - **Expected**: Error notification, token refresh attempt
   - **Assertions**: Token refresh or user notification

5. **Large Email Volume**
   - **Scenario**: User has hundreds of bill emails
   - **Expected**: Batch processing, pagination
   - **Assertions**: System handles large imports efficiently

### Dependencies
- Gmail API
- MongoDB database
- Background job processor
- Email parsing/NLP service
- Authentication service

---

## Test Flow 2: Manual Bill Creation and Management

### Test Scenario
User manually creates a bill, updates it, lists bills with filters, marks it as paid, and archives it.

### Prerequisites
- User is registered and authenticated
- MongoDB database (test instance)
- Valid access token

### Test Steps

1. **Create New Bill**
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
       "status": "PENDING",
       "autopay": false,
       "source": "MANUAL"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: Created bill object with `id`, `userId`, timestamps
   - **Assertions**:
     - Bill created in MongoDB
     - `userId` matches authenticated user
     - All fields stored correctly
     - `createdAt` and `updatedAt` set

2. **Update Bill**
   - **Action**: `PATCH /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "amount": 26000,
       "dueDate": "2024-02-10T00:00:00Z"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated bill object
   - **Assertions**:
     - Bill updated in database
     - Only specified fields updated
     - `updatedAt` timestamp changed
     - Other fields unchanged

3. **List Bills with Filters**
   - **Action**: `GET /api/v1/bills?status=PENDING&type=LOAN&page=1&limit=20`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "bills": [...],
       "total": 1,
       "page": 1,
       "limit": 20
     }
     ```
   - **Assertions**:
     - Only pending loan bills returned
     - Pagination works correctly
     - Total count accurate
     - Bills belong to authenticated user

4. **List Upcoming Bills**
   - **Action**: `GET /api/v1/bills/upcoming?days=30`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Array of bills due in next 30 days
   - **Assertions**:
     - Bills sorted by due date
     - Only bills within date range
     - Status can be PENDING or OVERDUE

5. **Mark Bill as Paid**
   - **Action**: `POST /api/v1/bills/{billId}/mark-paid`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "paymentId": "payment_123"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated bill with `status: "PAID"`
   - **Assertions**:
     - Bill status updated to PAID
     - Payment ID linked (if applicable)
     - `updatedAt` timestamp changed

6. **Archive Bill**
   - **Action**: `DELETE /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK` or `204 No Content`
   - **Assertions**:
     - Bill deleted or soft-deleted
     - Bill no longer appears in active listings
     - Historical data preserved (if soft delete)

### Expected Results
- Bill CRUD operations work correctly
- Filtering and pagination function properly
- Status updates are accurate
- User isolation is maintained

### Edge Cases

1. **Invalid Bill Data**
   - **Action**: Create bill with missing required fields
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation errors returned

2. **Update Non-existent Bill**
   - **Action**: Update bill with invalid ID
   - **Expected Response**: `404 Not Found`
   - **Assertions**: Error handling for missing bills

3. **Update Another User's Bill**
   - **Action**: Attempt to update bill belonging to different user
   - **Expected Response**: `403 Forbidden` or `404 Not Found`
   - **Assertions**: Authorization check works

4. **Invalid Date Range Filter**
   - **Action**: List bills with invalid date range
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Date validation works

5. **Large Result Set Pagination**
   - **Action**: List bills with large dataset
   - **Expected**: Pagination handles large sets
   - **Assertions**: Performance acceptable, all pages accessible

### Dependencies
- MongoDB database
- Authentication service
- Authorization middleware

---

## Test Flow 3: Recurring Bill Detection

### Test Scenario
System analyzes bill history, detects recurring patterns, suggests recurring bills to user, and optionally auto-creates them.

### Prerequisites
- User has multiple bills in history
- Bills with similar patterns (same provider, similar amount, monthly frequency)
- MongoDB database with bill history
- Background job processor for pattern analysis

### Test Steps

1. **Create Bill History**
   - **Action**: Create multiple bills with recurring pattern
   - **Example**: 3-6 months of bills from same provider with similar amounts
   - **Assertions**: Bills stored in database

2. **Trigger Recurring Detection**
   - **Action**: `GET /api/v1/bills/recurring-suggestions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     [
       {
         "title": "Home Loan EMI",
         "provider": "HDFC Bank",
         "amount": 25000,
         "frequency": "MONTHLY",
         "day": 5,
         "confidence": 0.95
       }
     ]
     ```
   - **Assertions**:
     - Recurring patterns detected
     - Suggestions include frequency and day
     - Confidence score provided
     - Only high-confidence suggestions returned

3. **Verify Pattern Detection Accuracy**
   - **Action**: Compare suggestions with actual bill history
   - **Assertions**:
     - Detected frequency matches actual pattern
     - Day of month is accurate
     - Amount range is reasonable
     - False positives are minimal

4. **User Confirms Recurring Bill**
   - **Action**: `POST /api/v1/bills` with recurrence data
   - **Request Body**:
     ```json
     {
       "title": "Home Loan EMI",
       "type": "LOAN",
       "provider": "HDFC Bank",
       "amount": 25000,
       "recurrence": {
         "frequency": "MONTHLY",
         "day": 5
       },
       "autopay": true
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**:
     - Recurring bill created with recurrence metadata
     - Future bills can be auto-generated

5. **Auto-Generation of Recurring Bills (Future)**
   - **Action**: Background job runs monthly
   - **Expected**: New bill created based on recurrence pattern
   - **Assertions**:
     - Bill created on correct date
     - Amount and details match pattern
     - Status set to PENDING

### Expected Results
- Recurring patterns accurately detected
- Suggestions are relevant and actionable
- Recurring bills can be created and managed
- Auto-generation works for confirmed recurring bills

### Edge Cases

1. **Variable Amount Bills**
   - **Scenario**: Bills with varying amounts (e.g., electricity usage)
   - **Expected**: Detection handles amount ranges
   - **Assertions**: Suggestions include amount range or average

2. **Variable Due Dates**
   - **Scenario**: Bills with slightly different due dates
   - **Expected**: Detection handles date variance
   - **Assertions**: Day range or most common day detected

3. **Insufficient History**
   - **Scenario**: User has only 1-2 bills from provider
   - **Expected**: Low confidence or no suggestion
   - **Assertions**: Only high-confidence suggestions returned

4. **One-off Bills Mistakenly Detected**
   - **Scenario**: One-time large payment
   - **Expected**: Not suggested as recurring
   - **Assertions**: False positive rate is low

5. **Multiple Recurring Patterns**
   - **Scenario**: User has multiple different recurring bills
   - **Expected**: All patterns detected separately
   - **Assertions**: Suggestions are distinct and accurate

### Dependencies
- MongoDB database
- Pattern detection algorithm
- Background job processor
- Authentication service

---

## Test Flow 4: Bill Payment Integration

### Test Scenario
Bill is created, payment is initiated, payment status updates, bill status synchronizes, and notifications are sent.

### Prerequisites
- User is registered and authenticated
- Bill exists in MongoDB
- Payment service is configured
- UPI account is linked (for UPI payments)

### Test Steps

1. **Create Bill**
   - **Action**: Create bill with status PENDING
   - **Assertions**: Bill created successfully

2. **Initiate Payment**
   - **Action**: `POST /api/v1/payments/pay-bill`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "billId": "bill_123",
       "paymentMethod": "UPI",
       "upiAccountId": "upi_account_456"
     }
     ```
   - **Expected Response**: `202 Accepted`
   - **Response Body**:
     ```json
     {
       "paymentId": "payment_789",
       "status": "INITIATED",
       "transactionReference": "txn_ref_abc"
     }
     ```
   - **Assertions**:
     - Payment record created in PostgreSQL
     - Payment linked to bill
     - Payment status is INITIATED

3. **Poll Payment Status**
   - **Action**: `GET /api/v1/payments/{paymentId}/status`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Payment object with current status
   - **Assertions**: Status updates correctly

4. **Payment Success Webhook/Callback**
   - **Action**: Simulate payment gateway callback
   - **Expected**: Payment status updated to SUCCESS
   - **Assertions**:
     - Payment record updated
     - Bill status updated to PAID (via `markBillPaid`)
     - `paidAt` timestamp set on payment
     - Bill `status` updated in MongoDB

5. **Verify Bill Status Update**
   - **Action**: `GET /api/v1/bills/{billId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Bill with `status: "PAID"`
   - **Assertions**:
     - Bill status synchronized
     - Payment ID linked to bill

6. **Verify Notification Sent**
   - **Action**: Check notification service
   - **Assertions**:
     - Payment success notification scheduled/sent
     - Notification includes payment and bill details

### Expected Results
- Payment and bill systems integrate correctly
- Status synchronization works
- Notifications are triggered
- Data consistency maintained across databases

### Edge Cases

1. **Payment Failure**
   - **Scenario**: Payment fails due to insufficient balance
   - **Expected**: Payment status FAILED, bill remains PENDING
   - **Assertions**: Failure notification sent, bill not marked paid

2. **Payment Timeout**
   - **Scenario**: Payment status unknown after timeout
   - **Expected**: Status set to PENDING, manual verification required
   - **Assertions**: Timeout handling works

3. **Concurrent Payment Attempts**
   - **Scenario**: Multiple payment attempts for same bill
   - **Expected**: Idempotency key prevents duplicates
   - **Assertions**: Only one payment succeeds

4. **Bill Deleted During Payment**
   - **Scenario**: Bill deleted while payment in progress
   - **Expected**: Payment completes but bill link may be broken
   - **Assertions**: Error handling for orphaned payments

5. **Payment Status Update Failure**
   - **Scenario**: Database error during status update
   - **Expected**: Retry logic or error notification
   - **Assertions**: System handles failures gracefully

### Dependencies
- Payment service
- Bill management service
- Notification service
- PostgreSQL (payments)
- MongoDB (bills)
- Payment gateway/webhook handler

---

## Test Flow 5: Complete Bill Lifecycle

### Test Scenario
End-to-end flow: Gmail import → Bill creation → Recurring detection → Payment → Status update → Notification.

### Prerequisites
- User with Gmail linked
- All services running
- Complete test environment

### Test Steps

1. Import bills from Gmail
2. Review and verify imported bills
3. Get recurring suggestions
4. Confirm recurring bill
5. Initiate payment for bill
6. Verify payment success
7. Verify bill status update
8. Verify notification delivery

### Expected Results
- Complete bill lifecycle works seamlessly
- All integrations function correctly
- Data consistency maintained

### Edge Cases
- Import failures
- Payment failures
- Notification delivery failures
- Data synchronization issues

### Dependencies
- All bill management services
- Payment service
- Notification service
- Gmail API
- Background jobs

