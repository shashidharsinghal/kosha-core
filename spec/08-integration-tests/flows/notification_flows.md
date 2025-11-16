# Notification Integration Test Flows

This document defines integration test cases for notification flows, including bill reminders, payment notifications, summary emails, and notification preference management.

## Test Flow 1: Bill Reminder Notifications

### Test Scenario
System schedules bill reminders before due dates, sends notifications via configured channels, and respects user preferences.

### Prerequisites
- User is registered and authenticated
- Bills exist with upcoming due dates
- Notification service running
- Email/SMS/Push services configured
- MongoDB database (for notifications and bills)

### Test Steps

1. **Create Bill with Upcoming Due Date**
   - **Action**: Create bill due in 3 days
   - **Request Body**:
     ```json
     {
       "title": "Electricity Bill",
       "amount": 2000,
       "dueDate": "2024-02-05T00:00:00Z"
     }
     ```
   - **Assertions**: Bill created successfully

2. **Schedule Bill Reminder**
   - **Action**: Background job or bill creation triggers reminder scheduling
   - **Expected**: Reminder notification scheduled
   - **Assertions**:
     - Notification record created in MongoDB
     - Notification type is BILL_REMINDER
     - Scheduled time is before due date (e.g., 1-2 days before)
     - Notification includes bill details in metadata

3. **Verify Notification Scheduled**
   - **Action**: `GET /api/v1/notifications?type=BILL_REMINDER&status=SCHEDULED`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of scheduled reminders
   - **Assertions**:
     - Reminder notification exists
     - Scheduled time correct
     - Bill metadata included

4. **Send Reminder Notification**
   - **Action**: Background job runs at scheduled time
   - **Expected**: Notification sent via configured channel
   - **Assertions**:
     - Notification status updated to SENT
     - `sentAt` timestamp set
     - Notification delivered via email/SMS/push

5. **Verify Notification Delivery**
   - **Action**: Check email/SMS/push service logs
   - **Assertions**:
     - Notification delivered successfully
     - Message content includes bill details
     - Delivery channel matches user preferences

6. **Verify Multiple Reminders**
   - **Action**: Create multiple bills with different due dates
   - **Expected**: Reminders scheduled for each bill
   - **Assertions**:
     - Each bill has reminder scheduled
     - Reminders sent at appropriate times
     - No duplicate reminders

### Expected Results
- Bill reminders scheduled correctly
- Notifications sent before due dates
- Delivery via configured channels
- Reminder content accurate
- User preferences respected

### Edge Cases

1. **Bill Paid Before Reminder**
   - **Scenario**: Bill paid before reminder scheduled time
   - **Expected**: Reminder cancelled or not sent
   - **Assertions**: Reminder cancellation works

2. **Multiple Reminders for Same Bill**
   - **Scenario**: System configured for multiple reminders (e.g., 7 days, 3 days, 1 day before)
   - **Expected**: All reminders scheduled and sent
   - **Assertions**: Multiple reminder scheduling works

3. **Reminder Delivery Failure**
   - **Scenario**: Email/SMS service unavailable
   - **Expected**: Retry logic or fallback channel
   - **Assertions**: Failure handling and retry

4. **User Preference Changes**
   - **Scenario**: User changes notification preferences after reminder scheduled
   - **Expected**: Reminder respects new preferences
   - **Assertions**: Preference updates applied

5. **Bill Due Date Changed**
   - **Scenario**: Bill due date updated after reminder scheduled
   - **Expected**: Reminder rescheduled or cancelled
   - **Assertions**: Reminder rescheduling works

### Dependencies
- Bill management service
- Notification service
- Email/SMS/Push services
- MongoDB database
- Background job processor
- User preference service

---

## Test Flow 2: Payment Notification Flow

### Test Scenario
Payment success or failure triggers notification, notification is sent to user, and notification history is maintained.

### Prerequisites
- User is registered and authenticated
- Payment service running
- Notification service running
- Email/SMS/Push services configured

### Test Steps

1. **Initiate Payment**
   - **Action**: Create payment for bill
   - **Assertions**: Payment created

2. **Payment Success Notification Trigger**
   - **Action**: Payment status updated to SUCCESS
   - **Expected**: Notification triggered automatically
   - **Assertions**:
     - Notification record created
     - Notification type is PAYMENT_SUCCESS
     - Notification includes payment details in metadata
     - Status set to SCHEDULED

3. **Send Payment Success Notification**
   - **Action**: Notification service processes scheduled notification
   - **Expected**: Notification sent immediately
   - **Assertions**:
     - Notification status updated to SENT
     - `sentAt` timestamp set
     - Notification delivered

4. **Verify Notification Content**
   - **Action**: Check notification message
   - **Assertions**:
     - Payment amount included
     - Bill details included
     - Transaction reference included
     - Success message clear

5. **Payment Failure Notification**
   - **Action**: Payment status updated to FAILED
   - **Expected**: Failure notification triggered
   - **Assertions**:
     - Notification type is PAYMENT_FAILED
     - Error details included in metadata
     - Notification sent to user

6. **Verify Notification History**
   - **Action**: `GET /api/v1/notifications?type=PAYMENT_SUCCESS`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of payment notifications
   - **Assertions**:
     - Payment notifications in history
     - Notifications linked to payments
     - History accurate

### Expected Results
- Payment notifications triggered correctly
- Notifications sent immediately
- Notification content accurate
- Notification history maintained
- Success and failure notifications work

### Edge Cases

1. **Payment Status Unknown**
   - **Scenario**: Payment status pending for extended time
   - **Expected**: No notification or pending notification
   - **Assertions**: Unknown status handling

2. **Multiple Payment Attempts**
   - **Scenario**: Multiple payments for same bill
   - **Expected**: Notifications for each attempt
   - **Assertions**: Multiple notifications handled

3. **Notification Delivery Failure**
   - **Scenario**: Email/SMS service fails
   - **Expected**: Retry logic or alternative channel
   - **Assertions**: Delivery failure handling

4. **Payment Reversal**
   - **Scenario**: Successful payment later reversed
   - **Expected**: Reversal notification sent
   - **Assertions**: Reversal handling

### Dependencies
- Payment service
- Notification service
- Email/SMS/Push services
- MongoDB database

---

## Test Flow 3: Notification Preferences Management

### Test Scenario
User configures notification preferences, sets DND times, selects channels, and notifications respect these preferences.

### Prerequisites
- User is registered and authenticated
- Notification service running
- MongoDB database

### Test Steps

1. **Get Current Preferences**
   - **Action**: `GET /api/v1/notifications/preferences`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "channels": ["EMAIL", "PUSH"],
       "dndStart": "22:00",
       "dndEnd": "08:00",
       "timezone": "Asia/Kolkata",
       "weeklySummaryDay": 0
     }
     ```
   - **Assertions**: Current preferences returned

2. **Update Notification Preferences**
   - **Action**: `PUT /api/v1/notifications/preferences`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "channels": ["EMAIL", "SMS", "PUSH"],
       "dndStart": "23:00",
       "dndEnd": "07:00",
       "timezone": "Asia/Kolkata",
       "weeklySummaryDay": 1
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**: Updated preferences
   - **Assertions**:
     - Preferences updated in MongoDB
     - All fields updated correctly
     - `updatedAt` timestamp changed

3. **Verify DND Enforcement**
   - **Action**: Schedule notification during DND hours
   - **Expected**: Notification delayed until DND ends
   - **Assertions**:
     - DND times respected
     - Notifications scheduled outside DND
     - Timezone handling correct

4. **Verify Channel Selection**
   - **Action**: Trigger notification
   - **Expected**: Notification sent only via enabled channels
   - **Assertions**:
     - Only selected channels used
     - Disabled channels not used

5. **Test Weekly Summary Preference**
   - **Action**: Background job runs on configured day
   - **Expected**: Weekly summary sent
   - **Assertions**:
     - Summary sent on correct day
     - Summary includes financial data
     - Channel preference respected

6. **Verify Preference Updates Applied**
   - **Action**: Create new notification after preference update
   - **Expected**: New preferences applied
   - **Assertions**:
     - Updated preferences used
     - Old notifications not affected

### Expected Results
- Preferences stored correctly
- DND times enforced
- Channel selection works
- Weekly summary scheduled correctly
- Preference updates applied immediately

### Edge Cases

1. **Invalid DND Times**
   - **Action**: Set DND end before start
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: DND time validation

2. **No Channels Selected**
   - **Action**: Disable all notification channels
   - **Expected**: Notifications not sent or queued
   - **Assertions**: All channels disabled handling

3. **Timezone Changes**
   - **Scenario**: User changes timezone
   - **Expected**: DND times adjusted for new timezone
   - **Assertions**: Timezone conversion works

4. **Preference Update During Notification Send**
   - **Scenario**: Preferences updated while notification sending
   - **Expected**: Current preferences used or queued notification uses old preferences
   - **Assertions**: Concurrency handling

### Dependencies
- Notification service
- MongoDB database
- Timezone service
- Email/SMS/Push services

---

## Test Flow 4: Summary Notifications

### Test Scenario
System sends daily/weekly/monthly summary notifications with financial insights, spending breakdowns, and upcoming bills.

### Prerequisites
- User is registered and authenticated
- User has financial data (bills, expenses, income)
- Notification service running
- Dashboard service for data aggregation

### Test Steps

1. **Configure Summary Preferences**
   - **Action**: Set weekly summary day preference
   - **Assertions**: Preference stored

2. **Trigger Weekly Summary**
   - **Action**: Background job runs on configured day
   - **Expected**: Summary notification scheduled
   - **Assertions**:
     - Summary notification created
     - Notification type is SUMMARY
     - Scheduled for appropriate time

3. **Generate Summary Data**
   - **Action**: Notification service aggregates data
   - **Expected**: Summary data prepared
   - **Assertions**:
     - Income totals calculated
     - Expense totals calculated
     - Bill summaries included
     - Spending breakdown prepared

4. **Send Summary Notification**
   - **Action**: Notification service sends summary
   - **Expected**: Summary email/SMS sent
   - **Assertions**:
     - Notification status updated to SENT
     - Summary content includes:
       - Total income
       - Total expenses
       - Net savings
       - Upcoming bills
       - Spending by category
       - Investment summary (if applicable)

5. **Verify Summary Content**
   - **Action**: Check notification message
   - **Assertions**:
     - All summary data included
     - Calculations accurate
     - Format readable
     - Links to dashboard included (if applicable)

6. **Test Daily Summary**
   - **Action**: Configure daily summary
   - **Expected**: Daily summary sent
   - **Assertions**: Daily summary works

7. **Test Monthly Summary**
   - **Action**: Configure monthly summary
   - **Expected**: Monthly summary sent
   - **Assertions**: Monthly summary works

### Expected Results
- Summary notifications scheduled correctly
- Summary data aggregated accurately
- Notifications sent on schedule
- Summary content comprehensive
- Multiple summary frequencies supported

### Edge Cases

1. **No Financial Data**
   - **Scenario**: User has no bills, expenses, or income
   - **Expected**: Summary sent with zero values or skipped
   - **Assertions**: Empty data handling

2. **Summary Generation Failure**
   - **Scenario**: Data aggregation fails
   - **Expected**: Error logged, retry or skip
   - **Assertions**: Failure handling

3. **Large Amount of Data**
   - **Scenario**: User has hundreds of transactions
   - **Expected**: Summary generated efficiently
   - **Assertions**: Performance acceptable

4. **Summary Delivery Failure**
   - **Scenario**: Email/SMS service fails
   - **Expected**: Retry logic
   - **Assertions**: Delivery failure handling

### Dependencies
- Notification service
- Dashboard service
- Bill management service
- Expense management service
- Income tracking service
- Investment monitoring service
- Email/SMS services

---

## Test Flow 5: Notification Delivery and Failure Handling

### Test Scenario
Notifications are delivered via multiple channels, delivery failures are handled with retries, and fallback mechanisms work.

### Prerequisites
- User is registered and authenticated
- Multiple notification channels configured
- Notification service running
- Email/SMS/Push services available

### Test Steps

1. **Send Notification via Primary Channel**
   - **Action**: Trigger notification with EMAIL as primary
   - **Expected**: Email sent successfully
   - **Assertions**: Email delivery works

2. **Primary Channel Failure**
   - **Action**: Simulate email service failure
   - **Expected**: Fallback to secondary channel (SMS)
   - **Assertions**:
     - Failure detected
     - Fallback channel used
     - Notification status updated

3. **Retry Logic**
   - **Action**: Notification delivery fails
   - **Expected**: Retry after delay
   - **Assertions**:
     - Retry scheduled
     - Retry count tracked
     - Max retries enforced

4. **Multiple Channel Delivery**
   - **Action**: User has multiple channels enabled
   - **Expected**: Notification sent via all enabled channels
   - **Assertions**:
     - All channels used
     - Delivery status tracked per channel

5. **Verify Delivery Status**
   - **Action**: `GET /api/v1/notifications/{notificationId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Notification with delivery status
   - **Assertions**:
     - Delivery status per channel included
     - Failure reasons logged
     - Retry information available

### Expected Results
- Notifications delivered via configured channels
- Failure handling works
- Retry logic functions
- Fallback mechanisms work
- Delivery status tracked

### Edge Cases

1. **All Channels Fail**
   - **Scenario**: All notification channels unavailable
   - **Expected**: Notification marked as failed, user notified via app
   - **Assertions**: Complete failure handling

2. **Partial Channel Failure**
   - **Scenario**: Some channels succeed, others fail
   - **Expected**: Successful channels deliver, failed channels retry
   - **Assertions**: Partial success handling

3. **Rate Limiting**
   - **Scenario**: Notification service rate limited
   - **Expected**: Notifications queued, sent when limit allows
   - **Assertions**: Rate limit handling

### Dependencies
- Notification service
- Email service
- SMS service
- Push notification service
- Retry service
- MongoDB database

---

## Test Flow 6: Complete Notification Lifecycle

### Test Scenario
End-to-end flow: Preference configuration → Bill reminder → Payment notification → Summary notification → Delivery tracking.

### Prerequisites
- User with authentication
- All services running
- Complete test environment

### Test Steps

1. Configure notification preferences
2. Create bill with due date
3. Verify reminder scheduled
4. Receive bill reminder
5. Make payment
6. Receive payment success notification
7. Receive weekly summary
8. View notification history

### Expected Results
- Complete notification lifecycle works seamlessly
- All notification types function
- Preferences respected
- Delivery tracking works
- User experience is smooth

### Edge Cases
- Preference conflicts
- Delivery failures
- Notification duplication
- Timezone issues

### Dependencies
- All notification services
- All feature services
- Email/SMS/Push services
- Background jobs

