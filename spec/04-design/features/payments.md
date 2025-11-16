# Payments & UPI Mandates – Technical Specification

## Technical Overview

This module enables users to link their UPI accounts, execute one‑off bill payments and create recurring mandates.  It integrates with bank and UPI provider APIs, handles payment lifecycles and stores transaction histories.  Security and reliability are paramount: the system must handle token management, retries and ensure idempotency of payment requests.  A relational database is chosen for its transactional guarantees.

### Data Model & Database Choice

UPI payments involve multi‑step workflows (initiate, verify, complete) and require consistent storage of transaction states.  The 2025 database comparison recommends Postgres when applications have **complex business logic and require complex queries**【163388115766043†L297-L302】.  Thus, we use **PostgreSQL** with the following tables:

* **upi_accounts**: `id (PK UUID)`, `user_id (FK)`, `provider`, `upi_id`, `linked_at`, `status`, `token` (encrypted refresh token).  
* **payments**: `id (PK UUID)`, `user_id`, `bill_id (nullable FK to bills in MongoDB or bridging table)`, `amount`, `upi_account_id (FK)`, `status` (`INITIATED`, `PENDING`, `SUCCESS`, `FAILED`), `initiated_at`, `completed_at`, `reference_id`, `error_code`, `error_message`.  
* **mandates**: `id (PK UUID)`, `user_id`, `upi_account_id`, `merchant`, `amount`, `frequency` (`MONTHLY`, `YEARLY`, etc.), `next_due_date`, `status` (`ACTIVE`, `PAUSED`, `CANCELLED`), `created_at`, `updated_at`.  
* **payment_logs**: optional table for auditing each API call and response.

Foreign keys enforce integrity between users, UPI accounts, payments and mandates.  Indexes on `user_id` and `status` speed up queries for user history and pending payments.

### REST API Endpoints

* `POST /api/v1/payments/link-upi` – Link a UPI account via provider OAuth; store token securely.  
* `GET /api/v1/payments/accounts` – List linked UPI accounts.  
* `POST /api/v1/payments` – Initiate payment for a bill; returns payment initiation status.  
* `GET /api/v1/payments/:id` – Get payment status and details.  
* `POST /api/v1/mandates` – Create a UPI mandate for recurring payments.  
* `GET /api/v1/mandates` – List mandates with status and next due date.  
* `PATCH /api/v1/mandates/:id` – Pause, resume or cancel a mandate.

Proper HTTP verbs and naming conventions are used【8357684761619†L134-L149】; endpoints return meaningful status codes such as `201 Created`, `200 OK`, `202 Accepted`, `400 Bad Request`, etc.【8357684761619†L152-L162】.

### Payment Flow

1. **Link UPI Account:** User initiates linking; the system redirects to the provider’s OAuth; on success, it stores encrypted tokens in `upi_accounts`.  
2. **Initiate Payment:** The user selects a bill and UPI account; the backend calls the provider’s payment initiation API and records a `payments` row with `status=INITIATED`.  
3. **Handle Callback:** Provider calls our webhook with transaction status; update the `payments` row to `SUCCESS` or `FAILED`, store reference ID and error details.  
4. **Create Mandate:** User sets up a recurring payment; the system calls UPI Autopay API to create the mandate, storing the `mandates` record with schedule.  
5. **Mandate Execution:** A scheduler triggers payments on due dates; each execution follows the same initiation & callback flow.

### Implementation Tasks

1. **Design PostgreSQL schema** and create migrations for `upi_accounts`, `payments`, `mandates` and `payment_logs`.  
2. **Integrate UPI provider APIs:** Implement OAuth linking, payment initiation, mandate creation and status callbacks.  Ensure idempotency keys to prevent duplicate payments.  
3. **Implement controllers** for linking, payment initiation, mandate management and retrieval.  
4. **Develop services** to manage payment state transitions, token refresh, retries and error handling.  
5. **Set up webhooks** to receive payment status updates and update records accordingly.  
6. **Build schedulers/workers** to execute mandates on due dates and retry failed payments.  
7. **Implement security measures:** Encrypt tokens, validate provider signatures, enforce rate limiting.  
8. **Write unit and integration tests** for payment flows, including mocking provider responses and ensuring consistent state transitions; follow best practices for acceptance testing【551007709182127†L435-L475】.

## Acceptance Tests

* **Link UPI Account:** Linking with valid credentials stores the account and returns success; invalid credentials or network errors return `401 Unauthorized` or `502 Bad Gateway`.  
* **Initiate Payment:** Valid payment request returns `202 Accepted` and creates a `payments` entry; insufficient balance or invalid UPI ID returns appropriate errors (`402 Payment Required` or `400 Bad Request`).  
* **Payment Callback:** On success callback, the payment status updates to `SUCCESS` and the reference ID is recorded; on failure, status becomes `FAILED` with error details.  
* **Create Mandate:** Creating a mandate stores schedule and returns `201 Created`; invalid recurrence values return `400 Bad Request`.  
* **Execute Mandate:** Scheduled jobs trigger payments; successful executions update `payments` and next due dates; failures generate notifications and retries.  
* **Pause/Cancel Mandate:** Updating a mandate’s status to `PAUSED` or `CANCELLED` prevents further payments.

These tests ensure secure and reliable payment operations, demonstrating compliance with acceptance testing best practices【551007709182127†L435-L475】.