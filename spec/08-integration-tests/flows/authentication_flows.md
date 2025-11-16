# Authentication Integration Test Flows

This document defines integration test cases for authentication and user management flows, including registration, login, Gmail linking, token refresh, and logout.

## Test Flow 1: User Registration and Initial Login

### Test Scenario
A new user registers with email and password, then successfully logs in to receive access and refresh tokens.

### Prerequisites
- Clean PostgreSQL database (test instance)
- Authentication service running
- No existing user with test email

### Test Steps

1. **Register New User**
   - **Action**: `POST /api/v1/auth/register`
   - **Request Body**:
     ```json
     {
       "email": "testuser@example.com",
       "password": "SecurePassword123!",
       "name": "Test User"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: User object with `id`, `email`, `name`, `createdAt` (no password hash)
   - **Assertions**:
     - User record exists in PostgreSQL `users` table
     - Password is hashed (not stored in plain text)
     - Email is unique and indexed
     - `createdAt` timestamp is set

2. **Login with Valid Credentials**
   - **Action**: `POST /api/v1/auth/login`
   - **Request Body**:
     ```json
     {
       "email": "testuser@example.com",
       "password": "SecurePassword123!"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "refreshToken": "refresh_token_abc123...",
       "user": {
         "id": "uuid",
         "email": "testuser@example.com",
         "name": "Test User"
       }
     }
     ```
   - **Assertions**:
     - Access token is valid JWT
     - Refresh token is generated and stored in `user_sessions` table
     - Session record has `expiresAt` timestamp
     - User object matches registered user

3. **Verify Token Validity**
   - **Action**: `GET /api/v1/auth/me` (protected endpoint)
   - **Headers**: `Authorization: Bearer {token}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Token is valid and not expired
     - Returns correct user information
     - Authentication middleware works correctly

### Expected Results
- User successfully registered and stored in database
- Login returns valid tokens
- Access token can be used for authenticated requests
- Session is properly tracked in database

### Edge Cases

1. **Duplicate Email Registration**
   - **Action**: Attempt to register with same email twice
   - **Expected Response**: `409 Conflict`
   - **Assertions**: Error message indicates duplicate email

2. **Invalid Email Format**
   - **Action**: Register with invalid email format
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation error for email format

3. **Weak Password**
   - **Action**: Register with weak password (e.g., "123")
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Password validation error

4. **Login with Invalid Credentials**
   - **Action**: Login with wrong password
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Error message indicates invalid credentials

5. **Login with Non-existent Email**
   - **Action**: Login with unregistered email
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Error message indicates invalid credentials

### Dependencies
- PostgreSQL database
- JWT token service
- Password hashing service (bcrypt)
- Authentication middleware

---

## Test Flow 2: Gmail Account Linking

### Test Scenario
An authenticated user links their Gmail account via OAuth to enable bill auto-import functionality.

### Prerequisites
- User is registered and logged in
- Valid access token
- Mock Google OAuth service configured
- Gmail API access enabled

### Test Steps

1. **Initiate Gmail Linking**
   - **Action**: `POST /api/v1/auth/link-gmail`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "oauthCode": "mock_oauth_code_12345"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "success": true
     }
     ```
   - **Assertions**:
     - OAuth code is exchanged for access and refresh tokens
     - `gmailRefreshToken` is stored in `users` table for the user
     - Token is encrypted/securely stored
     - User can now access Gmail API

2. **Verify Gmail Token Storage**
   - **Action**: Query database directly
   - **Assertions**:
     - `gmailRefreshToken` field is populated in user record
     - Token is not stored in plain text
     - Token expiration is tracked

3. **Test Gmail API Access**
   - **Action**: Trigger bill import (will use stored Gmail token)
   - **Expected**: Gmail API calls succeed using stored refresh token
   - **Assertions**:
     - Token refresh works when access token expires
     - Gmail API calls are authenticated correctly

### Expected Results
- Gmail account successfully linked
- Refresh token stored securely
- Gmail API access works for bill import

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

4. **User Already Has Gmail Linked**
   - **Action**: Attempt to link second Gmail account
   - **Expected Response**: `400 Bad Request` or token update
   - **Assertions**: Business rule enforced (one Gmail per user)

5. **Expired Gmail Token**
   - **Action**: Use expired Gmail token for API call
   - **Expected**: Token refresh attempt or error notification
   - **Assertions**: Token refresh mechanism works or user is notified

### Dependencies
- Google OAuth service
- Gmail API
- PostgreSQL database
- Token encryption service

---

## Test Flow 3: Token Refresh and Session Management

### Test Scenario
User's access token expires, they use refresh token to get new access token, then logout invalidates the session.

### Prerequisites
- User is registered and logged in
- Valid access token and refresh token
- Access token configured with short expiration (for testing)

### Test Steps

1. **Initial Login**
   - **Action**: `POST /api/v1/auth/login`
   - **Result**: Receive `accessToken` and `refreshToken`
   - **Assertions**: Both tokens are valid

2. **Access Token Expiration Simulation**
   - **Action**: Wait for token expiration or use expired token
   - **Action**: `GET /api/v1/auth/me` with expired token
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Expired token is rejected

3. **Refresh Access Token**
   - **Action**: `POST /api/v1/auth/refresh`
   - **Request Body**:
     ```json
     {
       "refreshToken": "{refreshToken}"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "token": "new_access_token...",
       "refreshToken": "new_refresh_token..."
     }
     ```
   - **Assertions**:
     - New access token is generated
     - New refresh token is generated (optional: token rotation)
     - Old refresh token is invalidated (if rotation enabled)
     - Session record is updated in database

4. **Use New Access Token**
   - **Action**: `GET /api/v1/auth/me` with new token
   - **Expected Response**: `200 OK`
   - **Assertions**: New token works correctly

5. **Logout and Invalidate Session**
   - **Action**: `DELETE /api/v1/auth/logout`
   - **Headers**: `Authorization: Bearer {newAccessToken}`
   - **Request Body**:
     ```json
     {
       "refreshToken": "{newRefreshToken}"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "success": true
     }
     ```
   - **Assertions**:
     - Refresh token is removed from `user_sessions` table
     - Session record is deleted or marked as invalid
     - Access token becomes invalid (if token blacklisting enabled)

6. **Verify Token Invalidation**
   - **Action**: Attempt to use refresh token after logout
   - **Action**: `POST /api/v1/auth/refresh` with old refresh token
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Refresh token no longer works

### Expected Results
- Token refresh mechanism works correctly
- New tokens are generated and valid
- Logout properly invalidates session
- Invalidated tokens cannot be used

### Edge Cases

1. **Expired Refresh Token**
   - **Action**: Attempt to refresh with expired refresh token
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Error message indicates expired token

2. **Invalid Refresh Token**
   - **Action**: Attempt to refresh with invalid/malformed token
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Error handling for invalid tokens

3. **Already Used Refresh Token (Token Rotation)**
   - **Action**: Use same refresh token twice (if rotation enabled)
   - **Expected Response**: `401 Unauthorized` on second use
   - **Assertions**: Token rotation security enforced

4. **Refresh Token Not Found**
   - **Action**: Use refresh token that doesn't exist in database
   - **Expected Response**: `401 Unauthorized`
   - **Assertions**: Database lookup fails correctly

5. **Concurrent Refresh Requests**
   - **Action**: Multiple refresh requests with same token simultaneously
   - **Expected**: One succeeds, others fail or handle gracefully
   - **Assertions**: Concurrency handling works

### Dependencies
- PostgreSQL database
- JWT token service
- Session management service
- Token blacklisting (optional)

---

## Test Flow 4: Complete Authentication Lifecycle

### Test Scenario
End-to-end flow covering registration, login, Gmail linking, token refresh, and logout in sequence.

### Prerequisites
- Clean test environment
- All external services mocked

### Test Steps

1. Register new user
2. Login and receive tokens
3. Use access token for authenticated request
4. Link Gmail account
5. Access token expires
6. Refresh access token
7. Use new token for authenticated request
8. Logout
9. Verify tokens are invalidated

### Expected Results
- Complete authentication lifecycle works seamlessly
- All steps execute successfully
- Security is maintained throughout

### Edge Cases
- Network interruptions during OAuth flow
- Token expiration during critical operations
- Multiple device sessions

### Dependencies
- All authentication services
- External OAuth providers
- Database consistency

