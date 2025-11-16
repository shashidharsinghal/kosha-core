/*
 * Notifications and Reminders feature specification.
 * Defines Notification and NotificationPreferences models for scheduling, sending and managing notification preferences.
 * Uses MongoDB for flexible document schema to handle varying notification types and metadata.
 */

feature("Notifications", () => {
  model("Notification", () => {
    field("id", "string");
    field("userId", "string");
    field("type", enum("BILL_REMINDER", "PAYMENT_SUCCESS", "PAYMENT_FAILED", "SUMMARY", "INCOME_ALERT", "EXPENSE_ALERT"));
    field("channel", enum("EMAIL", "SMS", "PUSH"));
    field("message", "string");
    field("scheduledAt", "datetime");
    field("sentAt", "datetime", { optional: true });
    field("status", enum("SCHEDULED", "SENT", "FAILED"));
    field("metadata", "object", { optional: true }); // e.g. {billId: "123", amount: 5000}
  });

  model("NotificationPreferences", () => {
    field("id", "string");
    field("userId", "string");
    field("channels", ["string"]); // array of enabled channels: ["EMAIL", "SMS", "PUSH"]
    field("dndStart", "string", { optional: true }); // e.g. "22:00"
    field("dndEnd", "string", { optional: true }); // e.g. "08:00"
    field("timezone", "string", { optional: true }); // e.g. "Asia/Kolkata"
    field("weeklySummaryDay", "number", { optional: true }); // 0-6 (Sunday-Saturday)
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  action("scheduleNotification", () => {
    param("notification", "Notification");
    returns("Notification");
  });

  action("sendNotification", () => {
    param("notificationId", "string");
    returns({ success: "boolean" });
  });

  // Get user notification preferences
  action("getPreferences", () => {
    param("userId", "string");
    returns("NotificationPreferences");
  });

  // Update user notification preferences
  action("updatePreferences", () => {
    param("userId", "string");
    param("preferences", "NotificationPreferences");
    returns("NotificationPreferences");
  });

  // List notifications for a user
  action("listNotifications", () => {
    param("userId", "string");
    param("status", enum("SCHEDULED", "SENT", "FAILED"), { optional: true });
    param("type", enum("BILL_REMINDER", "PAYMENT_SUCCESS", "PAYMENT_FAILED", "SUMMARY", "INCOME_ALERT", "EXPENSE_ALERT"), { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ notifications: ["Notification"], total: "number", page: "number", limit: "number" });
  });
});