# Bill Management

## Feature Description

Manage and monitor all user bills, including auto‑debits (e.g., loans, subscriptions) and manually paid bills (e.g., utility payments).

## Goals & Business Rules

* Allow creation and categorization of bills by source and type.
* Track due dates, payment status (paid/pending/overdue), and amount.
* Detect bill details automatically from Gmail and SMS.
* Allow users to add, edit, archive or delete bill entries.
* Show monthly bill calendar and upcoming payment alerts.
* Detect recurring bills automatically and suggest them based on past patterns.

## Edge Cases & Notes

* Handle bills with variable due dates (e.g., electricity usage).
* Detect duplicate bills from multiple sources (Gmail + SMS).
* Allow users to disable auto‑import for specific categories.
* Handle timezone differences for due dates.
* Integrate snooze/reminder options for certain bills.