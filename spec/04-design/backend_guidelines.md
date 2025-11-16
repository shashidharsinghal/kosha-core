# Backend Application Technical Guidelines

These guidelines outline conventions and best practices for building and maintaining the Kosha backend.  They apply across all services and modules to ensure consistency, security and maintainability.

## API Design

* **HTTP Methods & Routes:** Use the correct HTTP verbs (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`) and noun‑based resource names for endpoints.  For example, to create a user send `POST /users`; to update a user send `PATCH /users/:id`【8357684761619†L134-L149】.
* **Status Codes:** Return appropriate HTTP status codes — `2xx` for success, `4xx` for client errors (e.g., validation failure, not found) and `5xx` for server errors【8357684761619†L152-L162】.
* **Consistent Response Format:** Wrap responses in a consistent JSON structure with `data` and `error` keys.  Include error messages and codes for debugging.
* **Pagination & Filtering:** Use query parameters (`?page=1&limit=20`) for pagination and filtering.  Document supported filters for each endpoint.
* **API Versioning:** Prefix routes with a version (`/api/v1/…`) to support future changes without breaking clients.

## Layered Architecture

* **Controllers:** Handle HTTP requests, parse inputs, and delegate to services.  Do not contain business logic.
* **Services:** Encapsulate business rules.  Coordinate between repositories, external services and perform validations.
* **Repositories (Data Access Layer):** Interact with MongoDB/PostgreSQL.  Hide query details behind descriptive methods.  Use transactions where needed (PostgreSQL).
* **Background Workers:** For long‑running or asynchronous tasks (e.g., Gmail polling, payment callbacks), use separate worker processes or a message queue (e.g. n8n or custom queue).

## Error Handling

* Use a centralized error‑handling middleware (e.g., Express error handler) to capture exceptions and format error responses uniformly.
* Distinguish between client errors (validation failures, not found) and server errors (unexpected exceptions).  Do not expose stack traces in production.
* Log errors with context (request ID, user ID).  Consider integration with a logging service (e.g., Winston + Elasticsearch).

## Authentication & Authorization

* Use JWT (JSON Web Tokens) for stateless authentication【8357684761619†L271-L283】.  Refresh tokens should be stored securely and invalidated on logout.
* Protect routes with authentication middleware.  Extract user context from JWT and pass along to services.
* Implement role‑based access control (RBAC) for administrative endpoints (future scope).

## Security Considerations

* Always enforce HTTPS and secure cookies (SameSite, HttpOnly) for session tokens.
* Sanitize and validate user inputs to prevent injection attacks.  Use prepared statements or ORM/ODM features.
* Never log sensitive information (passwords, UPI PINs, tokens).
* Store secrets (e.g. database URIs, API keys) in environment variables and secret managers.
* Implement rate limiting to mitigate brute‑force attacks on login endpoints.

## Caching Strategy

* Use Redis to cache frequently accessed data (e.g. dashboard summaries, user session tokens).  Set appropriate TTLs to keep data fresh.
* Invalidate or update caches when underlying data changes (e.g. after paying a bill update the dashboard cache).

## Testing & Quality Assurance

* **Unit Tests:** Test services and repositories in isolation.  Mock external dependencies.
* **Integration Tests:** Use tools like Supertest to test API endpoints end‑to‑end, treating the API as a black box【8357684761619†L223-L233】.
* **Acceptance Tests:** Follow acceptance testing best practices—develop clear and detailed requirements, involve stakeholders early, create comprehensive test plans that mirror production environments, design thorough test cases covering edge scenarios, provide user training for UAT participants, manage defects effectively and run tests iteratively while documenting outcomes【551007709182127†L435-L475】.
* **Test Data:** Populate databases with fixture data before tests; use in‑memory databases or test containers.
* **Continuous Integration:** Run tests automatically on every pull request.  Enforce code coverage thresholds.

## Logging & Monitoring

* Use structured logging (JSON) to capture request IDs, timestamps, user IDs and severity levels.
* Capture metrics (e.g. request latency, error rates) and export them to a monitoring system (Prometheus, Grafana).
* Set up alerting for critical errors (payment failures, Gmail polling errors).

## Deployment & Environment

* Use environment variables for configuration; support different environments (dev, staging, production).
* Containerize services with Docker; use orchestrators like Kubernetes or serverless platforms.
* Implement health checks and readiness probes for each service.

Following these guidelines across the codebase will help produce a robust, maintainable and secure backend for Kosha.