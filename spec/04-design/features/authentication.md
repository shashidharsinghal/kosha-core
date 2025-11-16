# Authentication & User Management – Technical Specification

## Technical Overview

The authentication module provides secure user identity management and account linking.  It offers RESTful endpoints for registration, login, token refresh and Gmail account linking.  A layered architecture is used: **controllers** to handle HTTP requests, **services** to encapsulate business logic, and **repositories** to interact with the database.  Passwords are hashed using a strong algorithm (e.g., bcrypt) and JSON Web Tokens (JWT) are used for stateless authentication.  

### Data Model & Database Choice

Authentication requires relational constraints (unique emails, sessions) and benefits from strong ACID guarantees.  According to a 2025 comparison between Postgres and MongoDB, Postgres is better suited for applications with **complex business logic and queries**【163388115766043†L297-L302】.  Therefore this feature uses **PostgreSQL**.  Key tables include:

- **users**: `id (PK UUID)`, `email (unique)`, `password_hash`, `gmail_refresh_token`, `created_at`, `updated_at`.  
- **user_sessions**: `id (PK UUID)`, `user_id (FK to users)`, `refresh_token`, `expires_at`, `created_at`.  
- **user_roles** (future): `id`, `user_id`, `role`.

Indexes enforce uniqueness on email and accelerate login queries.

### REST API Endpoints

- `POST /api/v1/auth/register` – Create a new user with email and password.  
- `POST /api/v1/auth/login` – Authenticate a user and return access/refresh tokens.  
- `POST /api/v1/auth/refresh` – Exchange a refresh token for a new access token.  
- `POST /api/v1/auth/link-gmail` – Link the user’s Gmail account via OAuth.  
- `DELETE /api/v1/auth/logout` – Revoke the refresh token and invalidate the session.

These routes follow the guidelines of using correct HTTP verbs and resource names【8357684761619†L134-L149】 and return appropriate status codes【8357684761619†L152-L162】.

## Implementation Tasks

1. **Set up database schema** in PostgreSQL with `users` and `user_sessions` tables; create migrations.  
2. **Implement password hashing** using bcrypt and ensure secure storage.  
3. **Build controllers** to parse requests and call corresponding service functions.  
4. **Develop services** for registration, login, token refresh and Gmail linking; handle email uniqueness and token generation.  
5. **Integrate Gmail OAuth** using Google APIs; store refresh tokens securely.  
6. **Implement authentication middleware** to verify JWTs on protected routes.  
7. **Write unit tests** for service logic and **integration tests** for endpoints using a realistic test environment as recommended in acceptance testing best practices【551007709182127†L435-L475】.  
8. **Add logging and error handling** for invalid credentials, expired tokens and Gmail API failures.

## Acceptance Tests

- **User Registration:** Given a new email and valid password, the API returns `201 Created` and stores the user.  Duplicate email returns `409 Conflict`.  
- **User Login:** Valid credentials return an access token and refresh token; invalid credentials return `401 Unauthorized`.  
- **Token Refresh:** A valid refresh token returns a new access token; expired or revoked tokens return `401 Unauthorized`.  
- **Gmail Linking:** After OAuth, the service stores the refresh token and returns success; invalid or expired OAuth codes return `400 Bad Request`.  
- **Logout:** Revoking the session removes the refresh token from `user_sessions` and prevents further use.

These acceptance tests ensure the module meets its goals and follow the best practice of clear test cases covering requirements and edge scenarios【551007709182127†L435-L475】.