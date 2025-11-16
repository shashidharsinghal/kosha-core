/*
 * Payments feature specification.
 * Defines Payment, UPIAccount, and Mandate models for managing payments and recurring mandates.
 * Uses PostgreSQL for ACID guarantees and transactional consistency required for financial operations.
 */

feature("Payments", () => {
  model("Payment", () => {
    field("id", "string" /* UUID */);
    field("userId", "string");
    field("billId", "string", { optional: true }); // nullable FK to bills in MongoDB
    field("amount", "decimal");
    field("paidAt", "datetime", { optional: true }); // set when payment completes
    field("initiatedAt", "datetime");
    field("method", enum("UPI", "CARD", "NETBANKING"));
    field("status", enum("INITIATED", "PENDING", "SUCCESS", "FAILED"));
    field("transactionReference", "string", { optional: true });
    field("upiAccountId", "string", { optional: true }); // FK to UPIAccount
    field("errorCode", "string", { optional: true });
    field("errorMessage", "string", { optional: true });
  });

  model("UPIAccount", () => {
    field("id", "string" /* UUID */);
    field("userId", "string");
    field("provider", "string"); // e.g. "Razorpay", "PayU"
    field("upiId", "string");
    field("status", enum("ACTIVE", "INACTIVE", "EXPIRED"));
    field("linkedAt", "datetime");
    field("token", "string", { optional: true }); // encrypted refresh token
  });

  model("Mandate", () => {
    field("id", "string" /* UUID */);
    field("userId", "string");
    field("billId", "string"); // reference to bill in MongoDB
    field("upiAccountId", "string"); // FK to UPIAccount
    field("amount", "decimal");
    field("frequency", enum("MONTHLY", "YEARLY", "WEEKLY"));
    field("nextDueDate", "datetime");
    field("status", enum("ACTIVE", "PAUSED", "CANCELLED"));
    field("providerMandateId", "string", { optional: true }); // mandate ID from UPI provider
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Link a UPI account via provider OAuth
  action("linkUPIAccount", () => {
    param("userId", "string");
    param("provider", "string");
    param("oauthCode", "string"); // OAuth authorization code
    returns("UPIAccount");
  });

  // List linked UPI accounts
  action("listAccounts", () => {
    param("userId", "string");
    returns(["UPIAccount"]);
  });

  // Create a UPI Autopay mandate for a recurring bill
  action("createAutopayMandate", () => {
    param("billId", "string");
    param("upiAccountId", "string");
    param("frequency", enum("MONTHLY", "YEARLY", "WEEKLY"));
    returns("Mandate");
  });

  // List mandates for a user
  action("listMandates", () => {
    param("userId", "string");
    param("status", enum("ACTIVE", "PAUSED", "CANCELLED"), { optional: true });
    returns(["Mandate"]);
  });

  // Update mandate (pause, resume, cancel)
  action("updateMandate", () => {
    param("mandateId", "string");
    param("status", enum("ACTIVE", "PAUSED", "CANCELLED"));
    returns("Mandate");
  });

  // Pay a bill on demand via UPI
  action("payBill", () => {
    param("billId", "string");
    param("paymentMethod", enum("UPI", "CARD", "NETBANKING"));
    param("upiAccountId", "string", { optional: true }); // required if method is UPI
    param("idempotencyKey", "string", { optional: true }); // to prevent duplicate payments
    returns("Payment");
  });

  // Get payment history
  action("listPayments", () => {
    param("userId", "string");
    param("billId", "string", { optional: true });
    param("status", enum("INITIATED", "PENDING", "SUCCESS", "FAILED"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ payments: ["Payment"], total: "number", page: "number", limit: "number" });
  });

  // Get payment status
  action("getPaymentStatus", () => {
    param("paymentId", "string");
    returns("Payment");
  });
});