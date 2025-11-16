/*
 * Aggregated entry point for backend feature specifications.
 * This file imports individual feature specs defined in the `features/` directory.
 * Tools like Cursor can use this file to generate boilerplate for the entire backend.
 */

import "./features/authentication.spec";
import "./features/bill_management.spec";
import "./features/income_tracking.spec";
import "./features/expense_management.spec";
import "./features/investment_monitoring.spec";
import "./features/payments.spec";
import "./features/notifications.spec";
import "./features/dashboard.spec";

// Additional features can be imported here as the project grows.