# Global Technical Rules

This document outlines overarching technical conventions for the Kosha application that apply across all services and components.  Following these rules promotes consistency, maintainability and quality across the project.

## Architecture

* **Layered Design:** Use a clear separation between presentation (UI), application (controllers), business logic (services) and data access (repositories).  Each layer should depend only on the layer below it, promoting testability and modularity.
* **Microservices Where Appropriate:** Isolate complex integrations (Gmail import, payments, notifications) into separate services that communicate via HTTP or message queues.  Keep the core API thin and orchestrate business processes in services.
* **Stateless Services:** Design services to be stateless; store session or workflow state in the database or cache, not in memory.
* **Use Asynchronous Processing:** Offload long‑running or external calls (email parsing, payment processing) to background workers or n8n flows.  Do not block HTTP requests for these tasks.

## API Design & HTTP Practices

* **RESTful Endpoints:** Use HTTP verbs and noun‑based resource names (e.g., `POST /users`, `GET /bills/:id`, `PATCH /payments/:id`).  Avoid verbs in endpoint paths【8357684761619†L134-L149】.  Prefix API routes with version (`/api/v1`) to enable backward‑compatible evolution.
* **Status Codes:** Return standard HTTP status codes—`201 Created` for successful resource creation, `200 OK` for retrieval, `400 Bad Request` for validation errors, `401/403` for auth failures, `404 Not Found` for missing resources, `409 Conflict` for duplicates and `500` series for server errors【8357684761619†L152-L162】.
* **Consistent Response Format:** Wrap API responses in a structure containing `data` and `error` fields.  Provide clear error messages and codes to assist clients.
* **Pagination & Filtering:** Expose query parameters (`page`, `limit`, `sort`, `filter`) for listing endpoints.  Document the supported filters for each resource.
* **Idempotency & Retries:** For operations like payments or imports, implement idempotency keys to prevent duplicate processing; clients can safely retry requests.

## Security

* **Authentication:** Use JWTs for stateless authentication; store refresh tokens securely and rotate them regularly.  Use environment variables and secret managers to store sensitive keys.  Employ role‑based access control (RBAC) for admin operations.
* **Input Validation & Sanitization:** Validate all user inputs on the server; sanitize strings to prevent injection attacks.  Use ORM/ODM prepared queries to avoid SQL/NoSQL injection.
* **Transport Security:** Enforce HTTPS for all external and internal communications.  Use TLS certificates and rotate them periodically.
* **Rate Limiting & Abuse Protection:** Implement rate limiting on authentication and sensitive endpoints to prevent brute force attacks.  Monitor anomalies and throttle suspicious traffic.

## Testing & Quality

* **Test Pyramid:** Balance unit, integration and acceptance tests.  Unit tests focus on services and utilities; integration tests validate API endpoints and database interactions; acceptance tests ensure the system meets requirements and user expectations【551007709182127†L435-L475】.
* **Realistic Test Environments:** Mirror production conditions in test setups (e.g., same database type, similar configurations).  Use seeded data and fixtures to reproduce scenarios.
* **Continuous Integration & Code Quality:** Use CI pipelines to run linting, static analysis, tests and vulnerability scanning on every pull request.  Enforce code formatting (Prettier, ESLint) and consistent TypeScript settings.

## Database & Data Management

* **Appropriate Store Selection:** Choose the right database based on data characteristics—MongoDB for flexible, unstructured collections; PostgreSQL for relational, ACID‑compliant data【163388115766043†L297-L302】.  Use Redis for caching frequently accessed data and session tokens.
* **Migrations & Schema Management:** Use migration tools (e.g., Prisma, Knex) to version control schema changes.  Migrations should be reviewed and run via CI before deployment.
* **Indexing & Performance:** Create indexes on commonly filtered fields (`user_id`, `date`) to accelerate queries.  Monitor query performance and adjust indexes as needed.
* **Data Retention & Privacy:** Define retention policies for old data (e.g., purge notifications after 6 months).  Comply with data protection laws and provide mechanisms for users to delete their data.

## Logging & Monitoring

* **Structured Logging:** Log requests and responses in structured JSON, including request IDs, user IDs, timestamps and severity levels.  Avoid logging sensitive data (passwords, tokens).
* **Metrics & Alerting:** Collect metrics such as request latency, error rates and job durations.  Set up alerts for anomalies (e.g., spike in failed payments).  Use dashboards (Grafana, Kibana) for visibility.
* **Tracing:** Use distributed tracing (OpenTelemetry) to follow requests across services, especially for asynchronous workflows.

## Deployment & Environment

* **Containerization:** Package services using Docker; use orchestration (Kubernetes, Docker Compose) to manage scaling and resilience.  Define health and readiness probes.  
* **Configuration & Secrets:** Store configuration in environment variables; separate config per environment (dev, staging, prod).  Use secret management tools for sensitive values.
* **Blue/Green & Rollbacks:** Implement deployment strategies (blue/green, canary) to minimize downtime.  Maintain rollbacks to previous versions in case of failures.

These global rules serve as a foundation for all technical work within Kosha.  They complement feature‑specific designs and ensure coherence across the application.