# Bill Management – Technical Specification

## Technical Overview

The bill management feature consolidates all user bills—auto‑debits, subscriptions and manually paid utilities—into a single dashboard.  It exposes RESTful endpoints for CRUD operations and uses background jobs to import bills from Gmail and SMS.  A microservice processes incoming messages, extracts bill metadata via natural language processing (NLP) and stores structured records.  A scheduler identifies recurring bills and suggests them to users.

### Data Model & Database Choice

Bills vary widely by merchant, amount and due date, making a flexible schema advantageous.  According to a 2025 comparison, MongoDB is well‑suited for applications with a **simple data model and web‑scale data**【163388115766043†L297-L302】.  Thus, this module uses **MongoDB** for the `bills` collection:

* **bills** (collection):
  * `_id` – unique identifier (ObjectId).  
  * `user_id` – reference to the user.
  * `title` – merchant or bill name.
  * `amount` – numeric amount.
  * `due_date` – ISO date; optional for auto‑debits.
  * `status` – `PENDING`, `PAID`, `OVERDUE`.
  * `type` – `AUTO_DEBIT`, `MANUAL`, `LOAN` etc.
  * `recurrence` – optional object (e.g., `{frequency: 'MONTHLY', day: 5}`).
  * `source` – `GMAIL`, `SMS`, `MANUAL`.
  * `created_at`, `updated_at` – timestamps.

Indexes on `user_id` and `due_date` enable efficient queries for a user’s upcoming bills.

### REST API Endpoints

* `GET /api/v1/bills` – List bills with optional filters (status, type, month).  Supports pagination.  
* `POST /api/v1/bills` – Create a new bill manually.  
* `PATCH /api/v1/bills/:id` – Update an existing bill (amount, due date, status).  
* `DELETE /api/v1/bills/:id` – Archive or delete a bill.  
* `POST /api/v1/bills/import/gmail` – Trigger Gmail import for the authenticated user.  
* `GET /api/v1/bills/recurring-suggestions` – Suggest recurring bills detected from past patterns.

Endpoint design follows REST conventions【8357684761619†L134-L149】 and returns appropriate HTTP status codes【8357684761619†L152-L162】.

### Background Processing

* **Gmail Import Worker:** Polls the user’s Gmail using OAuth, parses payment emails, extracts bill information and upserts documents in `bills` with `source = GMAIL`.  Handles duplicate detection.  
* **SMS Import Worker (future):** Similar to Gmail but via SMS API.  
* **Recurring Bill Detector:** Runs nightly to analyze each user’s bill history; identifies patterns (e.g., same merchant and similar amount every month) and populates suggestions.

## Implementation Tasks

1. **Define MongoDB schema** for the `bills` collection and create indexes.  
2. **Implement controllers** for bill CRUD operations, supporting filtering and pagination.  
3. **Develop services** to handle business logic: create/update bills, merge duplicate imports, detect recurrence.  
4. **Integrate Gmail API** to fetch billing emails; implement parsing logic and error handling.  
5. **Implement recurring detection** using heuristics (e.g., monthly frequency, similar amounts).  
6. **Build background workers** (Node.js or n8n flows) for Gmail import and recurring detection; schedule via a job scheduler.  
7. **Cache frequently accessed queries** (e.g., upcoming bills) in Redis; invalidate caches on changes.  
8. **Write integration tests** for API endpoints and workers; use realistic test data and follow acceptance testing best practices【551007709182127†L435-L475】.

## Acceptance Tests

* **Create Bill:** Posting a valid bill returns `201 Created`; missing fields return `400 Bad Request`.  
* **List Bills:** A GET request returns bills filtered by status/type; supports pagination with `page` and `limit` parameters.  
* **Update Bill:** Changing amount or due date updates the document; invalid IDs return `404 Not Found`.  
* **Import from Gmail:** Triggering import fetches emails, creates bill documents with `source = GMAIL`, deduplicates duplicates, and returns `202 Accepted`.  
* **Recurring Suggestions:** Request returns a list of suggested recurring bills based on past patterns; suggestions are accurate and exclude one‑off bills.

These tests verify that bill management meets functional goals and cover edge scenarios (duplicates, missing data, recurrence).  They reflect the principle of thorough test case design and clear requirements for acceptance testing【551007709182127†L435-L475】.