# Income Tracking – Technical Specification

## Technical Overview

The income tracking feature records and categorizes money flowing into a user’s account.  It supports recurring and one‑off entries, integrates with payroll emails and bank feeds (future) and produces summaries for dashboards.  The system exposes RESTful endpoints for CRUD operations and uses background jobs to import incomes from Gmail.

### Data Model & Database Choice

Income entries have a consistent yet flexible structure (amount, date, category, source).  MongoDB’s document model suits this simple schema and provides native JSON storage, which is popular among full‑stack developers【163388115766043†L175-L179】.  Therefore, income data is stored in a **MongoDB** collection:

* **incomes** (collection):
  * `_id` – ObjectId.  
  * `user_id` – reference to the user.  
  * `title` – description of the income (e.g., “Salary August”).  
  * `type` – `SALARY`, `FREELANCE`, `INTEREST`, etc.  
  * `amount` – numeric amount.  
  * `received_on` – date of deposit.  
  * `recurrence` – optional (e.g., `{frequency: 'MONTHLY', day: 30}`).  
  * `source` – `MANUAL`, `GMAIL`.  
  * `notes` – optional remarks.  
  * `created_at`, `updated_at` – timestamps.

Indexes on `user_id` and `received_on` support fast queries for monthly totals and trend analysis.

### REST API Endpoints

* `GET /api/v1/incomes` – Retrieve incomes with filters (date range, type).  Supports pagination.  
* `POST /api/v1/incomes` – Create a new income record.  
* `PATCH /api/v1/incomes/:id` – Update an income (amount, date, type, notes).  
* `DELETE /api/v1/incomes/:id` – Delete an income.  
* `POST /api/v1/incomes/import/gmail` – Import income entries from payroll or payment confirmation emails.  
* `GET /api/v1/incomes/summary` – Return monthly and yearly income summaries for dashboards.

Routes use proper HTTP verbs and noun‑based names【8357684761619†L134-L149】, returning appropriate status codes【8357684761619†L152-L162】.

### Background Processing

* **Gmail Import Worker:** Authenticates via Gmail OAuth, searches for salary slips or payment notifications, parses amounts and dates, and stores them as `incomes` documents with `source = GMAIL`.
* **Recurring Income Detector:** Suggests recurring income entries (e.g., salary) based on patterns in the `incomes` collection.

## Implementation Tasks

1. **Define MongoDB schema** for `incomes` and create indexes.  
2. **Implement controllers** to handle CRUD operations and summary queries.  
3. **Develop services** to manage income logic, ensure correct categorization and handle recurrence.  
4. **Build Gmail import worker** to parse payroll emails; handle date variations and errors.  
5. **Implement summary calculations** to aggregate incomes by month, type and provide totals for dashboards.  
6. **Cache summary data** using Redis to improve dashboard performance.  
7. **Write integration and unit tests** to ensure endpoints and workers behave correctly; follow best practices for test planning and realistic environments【551007709182127†L435-L475】.

## Acceptance Tests

* **Create Income:** Valid request yields `201 Created`; missing `amount` or `type` returns `400 Bad Request`.  
* **List Incomes:** Returns incomes filtered by date range and type; supports pagination.  
* **Update Income:** Updates the amount or type; invalid IDs yield `404 Not Found`.  
* **Gmail Import:** Parses payroll emails and stores new entries; handles duplicates gracefully.  
* **Summary Endpoint:** Returns correct monthly totals and categorization of incomes.

These tests confirm that income tracking meets functional goals and handle variations such as recurring patterns and import duplicates while adhering to acceptance test best practices【551007709182127†L435-L475】.