/*
 * Bill Management feature specification.
 * Defines the Bill model and actions for importing, creating, updating and listing bills.
 * Uses MongoDB for flexible document schema to handle varying bill structures.
 */

feature("BillManagement", () => {
  model("Bill", () => {
    field("id", "string");
    field("userId", "string");
    field("title", "string"); // e.g. "Home Loan EMI", "Electricity Bill"
    field("type", enum("LOAN", "SUBSCRIPTION", "CREDIT_CARD", "UTILITY", "OTHER"));
    field("provider", "string", { optional: true }); // lender, merchant or issuer
    field("amount", "decimal");
    field("dueDate", "datetime");
    field("status", enum("PENDING", "PAID", "OVERDUE"));
    field("autopay", "boolean", { default: false });
    field("autopayMandateId", "string", { optional: true });
    field("source", enum("GMAIL", "SMS", "MANUAL"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY", day: 5}
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Automatically ingest bills from Gmail (and potentially SMS)
  action("importBills", () => {
    param("userId", "string");
    param("source", enum("GMAIL", "SMS"), { optional: true });
    returns({ imported: "number", failed: "number" });
  });

  // Manually add or update a bill
  action("upsertBill", () => {
    param("bill", "Bill");
    returns("Bill");
  });

  // Mark a bill as paid after successful payment
  action("markBillPaid", () => {
    param("billId", "string");
    param("paymentId", "string");
    returns("Bill");
  });

  // Retrieve upcoming bills for a user
  action("listUpcomingBills", () => {
    param("userId", "string");
    param("days", "number", { optional: true, default: 30 }); // number of days ahead to look
    returns(["Bill"]);
  });

  // List bills with filters and pagination
  action("listBills", () => {
    param("userId", "string");
    param("status", enum("PENDING", "PAID", "OVERDUE"), { optional: true });
    param("type", enum("LOAN", "SUBSCRIPTION", "CREDIT_CARD", "UTILITY", "OTHER"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "dueDate", "-dueDate"
    returns({ bills: ["Bill"], total: "number", page: "number", limit: "number" });
  });

  // Get recurring bill suggestions based on past patterns
  action("getRecurringSuggestions", () => {
    param("userId", "string");
    returns(["Bill"]); // suggested recurring bills
  });
});