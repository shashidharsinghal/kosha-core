/*
 * Expense Management feature specification.
 * Defines the Expense model and actions for adding, updating, listing, deleting, importing and summarizing expenses.
 * Uses MongoDB for flexible document schema to handle varying expense structures.
 */

feature("ExpenseManagement", () => {
  model("Expense", () => {
    field("id", "string");
    field("userId", "string");
    field("description", "string");
    field("category", "string"); // e.g. "Food", "Transportation"
    field("amount", "decimal");
    field("spentAt", "datetime");
    field("paymentMethod", enum("CASH", "CARD", "UPI", "OTHER"));
    field("notes", "string", { optional: true });
    field("source", enum("MANUAL", "UPI", "SMS", "CARD"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY"}
  });
  action("addExpense", () => {
    param("expense", "Expense");
    returns("Expense");
  });
  action("updateExpense", () => {
    param("expense", "Expense");
    returns("Expense");
  });
  action("listExpenses", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("category", "string", { optional: true });
    param("paymentMethod", enum("CASH", "CARD", "UPI", "OTHER"), { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "spentAt", "-spentAt"
    returns({ expenses: ["Expense"], total: "number", page: "number", limit: "number" });
  });
  action("deleteExpense", () => {
    param("expenseId", "string");
    returns({ success: "boolean" });
  });
  // Import expenses from external sources (UPI, card statements)
  action("importExpenses", () => {
    param("userId", "string");
    param("source", enum("UPI", "CARD", "SMS"));
    returns({ imported: "number", failed: "number" });
  });
  // Get expense summary (category breakdown, monthly totals, burn rate)
  action("getSummary", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns({ total: "decimal", byCategory: "object", byMonth: "object", burnRate: "decimal" });
  });
});