/*
 * Income Tracking feature specification.
 * Defines the Income model and actions for adding, updating, listing, deleting, importing and summarizing income records.
 * Uses MongoDB for flexible document schema to handle varying income structures.
 */

feature("IncomeTracking", () => {
  model("Income", () => {
    field("id", "string");
    field("userId", "string");
    field("source", "string"); // e.g. "Salary", "Freelance", "Interest"
    field("amount", "decimal");
    field("receivedAt", "datetime");
    field("category", "string", { optional: true });
    field("notes", "string", { optional: true });
    field("importSource", enum("MANUAL", "GMAIL"), { optional: true });
    field("recurrence", "object", { optional: true }); // e.g. {frequency: "MONTHLY", day: 30}
  });

  action("addIncome", () => {
    param("income", "Income");
    returns("Income");
  });
  action("updateIncome", () => {
    param("income", "Income");
    returns("Income");
  });
  action("listIncomes", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("category", "string", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    param("sort", "string", { optional: true }); // e.g. "receivedAt", "-receivedAt"
    returns({ incomes: ["Income"], total: "number", page: "number", limit: "number" });
  });
  action("deleteIncome", () => {
    param("incomeId", "string");
    returns({ success: "boolean" });
  });
  // Import income entries from Gmail (payroll emails)
  action("importIncomes", () => {
    param("userId", "string");
    returns({ imported: "number", failed: "number" });
  });
  // Get income summary (monthly totals, by category)
  action("getSummary", () => {
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns({ total: "decimal", byCategory: "object", byMonth: "object" });
  });
});