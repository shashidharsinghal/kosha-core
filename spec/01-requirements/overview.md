# Kosha – Vision and High‑Level Requirements

Kosha is envisioned as a **personal finance hub** that consolidates earning, spending, investing and bill payments into a single application.  This document provides a narrative description of the core features and their rationale, serving as a starting point for more detailed specifications.

## 1. Mission and Objectives

The mission of Kosha is to empower individuals to **understand, organize and improve** their financial lives.  The product aims to eliminate bill‑payment stress, provide insight into income and spending patterns, and support informed investment decisions — all in one place.  By automating data collection (from Gmail and SMS), integrating with payment systems (UPI and cards) and providing intelligent reminders and analytics, Kosha seeks to be a trusted daily companion for personal finance.

## 2. Feature Narratives

### 2.1 User Account and Authentication

**What:** Provide a secure way for users to create an account, log in and connect external services like Gmail.

**Why:** Personalized experiences require user accounts and secure data storage.  Linking a Gmail account enables automatic bill ingestion.  Support for Google OAuth simplifies onboarding and avoids password management.

### 2.2 Bill Management

**What:** Collect recurring and one‑off bills from various sources (emails, SMS, manual input).  Display a list of upcoming due dates, track payment status and offer one‑click payment via UPI or card.  Support autopay mandates for recurring bills.

**Why:** Users often juggle multiple loans, subscriptions and utilities.  A single dashboard reduces cognitive load and minimizes missed payments by centralizing due dates and payment history.

### 2.3 Income Tracking

**What:** Record different income streams (salaries, freelance work, interest and dividends).  Provide a timeline of income events and totals per month.

**Why:** Understanding total cash inflow is foundational to budgeting and financial planning.  Categorizing income helps users see contributions from various sources and identify trends.

### 2.4 Expense Management

**What:** Log everyday expenses and categorize them (food, transport, entertainment, etc.).  Offer a breakdown of spending by category and highlight unusual spikes.

**Why:** Budgeting requires visibility into where money goes.  Categorized expenses enable users to identify overspending areas and adjust behavior accordingly.

### 2.5 Investment Monitoring

**What:** Provide an inventory of the user’s investments (stocks, mutual funds, fixed deposits, bonds).  Track purchase values and current market values, and display returns over time.  Pull live price data from third‑party market APIs.

**Why:** Many users maintain investments across multiple platforms and lose sight of their overall portfolio.  Consolidation enables an at‑a‑glance view of net worth and investment performance.

### 2.6 Payments and UPI Integration

**What:** Enable users to pay bills directly from the app using UPI, cards or net banking.  Support setting up UPI Autopay mandates for recurring bills.  Record each payment with status and reference.

**Why:** Seamless payments mean fewer missed deadlines and no need to switch apps.  Autopay reduces manual effort while still allowing users to monitor and manage mandates.

### 2.7 Notifications and Reminders

**What:** Send timely reminders ahead of bill due dates, notifications for successful or failed payments, and alerts for income or investment events.  Deliver messages via email, SMS or push notifications based on user preference.

**Why:** Proactive reminders minimize missed payments.  Confirmation notifications provide peace of mind after transactions.  Insights into income or investment changes keep users engaged with their finances.

### 2.8 Dashboard and Insights

**What:** Offer a visual summary of the user’s financial status: upcoming bills, income vs expenses, spending by category and overall net worth.  Present charts and trends to help users understand their financial health.

**Why:** A dashboard transforms raw data into actionable insights.  Seeing trends can motivate users to adjust behavior, set goals and track progress toward financial objectives.

## 3. Next Steps

This requirements document should be refined collaboratively with stakeholders.  Once finalized, each feature’s narrative should be translated into detailed design documents and spec‑kit definitions under `spec/design` and `spec/backend`, respectively.
