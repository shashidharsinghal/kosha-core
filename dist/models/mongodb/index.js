"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferences = exports.Notification = exports.Income = exports.Expense = exports.Bill = void 0;
// MongoDB Schema Exports
var bill_schema_1 = require("./bills/bill.schema");
Object.defineProperty(exports, "Bill", { enumerable: true, get: function () { return bill_schema_1.Bill; } });
var expense_schema_1 = require("./expenses/expense.schema");
Object.defineProperty(exports, "Expense", { enumerable: true, get: function () { return expense_schema_1.Expense; } });
var income_schema_1 = require("./income/income.schema");
Object.defineProperty(exports, "Income", { enumerable: true, get: function () { return income_schema_1.Income; } });
var notification_schema_1 = require("./notifications/notification.schema");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_schema_1.Notification; } });
var notification_preferences_schema_1 = require("./notifications/notification-preferences.schema");
Object.defineProperty(exports, "NotificationPreferences", { enumerable: true, get: function () { return notification_preferences_schema_1.NotificationPreferences; } });
//# sourceMappingURL=index.js.map