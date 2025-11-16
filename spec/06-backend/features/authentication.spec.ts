/*
 * Authentication and User Management feature specification.
 * Defines the User model and actions for registration, login, token refresh, logout and linking Gmail.
 * Uses PostgreSQL for ACID guarantees and relational integrity.
 */

feature("Authentication", () => {
  // Represents an end user of the system
  model("User", () => {
    field("id", "string" /* UUID */);
    field("email", "string");
    field("name", "string");
    field("passwordHash", "string"); // hashed password if using local auth
    field("googleOAuthToken", "string", { optional: true });
    field("gmailRefreshToken", "string", { optional: true }); // for Gmail API access
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Represents a user session with refresh token
  model("UserSession", () => {
    field("id", "string" /* UUID */);
    field("userId", "string");
    field("refreshToken", "string");
    field("expiresAt", "datetime");
    field("createdAt", "datetime");
  });

  // Sign up with email/password or via Google OAuth
  action("register", () => {
    param("email", "string");
    param("password", "string");
    param("name", "string", { optional: true });
    returns("User");
  });

  action("login", () => {
    param("email", "string");
    param("password", "string");
    returns({ token: "string", refreshToken: "string", user: "User" });
  });

  // Refresh access token using refresh token
  action("refresh", () => {
    param("refreshToken", "string");
    returns({ token: "string", refreshToken: "string" });
  });

  // Logout and invalidate refresh token
  action("logout", () => {
    param("refreshToken", "string");
    returns({ success: "boolean" });
  });

  // Link user's Gmail account to fetch bills
  action("linkGmail", () => {
    param("userId", "string");
    param("oauthCode", "string"); // OAuth authorization code from Google
    returns({ success: "boolean" });
  });
});