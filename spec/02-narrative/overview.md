# Kosha Product Overview and Feature Rationale

Kosha is envisioned as a **personal finance hub** that consolidates earning, spending, investing and bill payments into a single application.  Before diving into any implementation or code, it’s important to articulate **what** each feature does and **why** it exists.  This document provides a narrative description of the core features and their rationale.

## 1. Vision and Objectives

The mission of Kosha is to empower individuals to **understand, organize and improve** their financial lives.  The product aims to eliminate bill‑payment stress, provide insight into income and spending patterns, and support informed investment decisions — all in one place.  By automating data collection (from Gmail and SMS), integrating with payment systems (UPI and cards) and providing intelligent reminders and analytics, Kosha seeks to be a trusted daily companion for personal finance.

## 2. Feature Narratives

### 2.1 User Account and Authentication

**What:** A secure way for users to create an account, log in and connect external services like Gmail.

**Why:** To personalize the experience and protect sensitive financial data.  Linking a Gmail account enables automatic bill ingestion.  Support for Google OAuth simplifies onboarding and avoids password management.

### 2.2 Bill Management

**What:** Collects recurring and one‑off bills from various sources (emails, SMS, manual input).  Displays a list of upcoming due dates, tracks payment status and offers one‑click payment via UPI or card.  Supports autopay mandates for recurring bills.

**Why:** Users often juggle multiple loans, subscriptions and utilities.  Missing a payment can incur late fees or damage credit.  A single dashboard showing all bills, along with due dates and statuses, reduces cognitive load.  Integration with payment gateways streamlines settlement.

### 2.3 Income Tracking

**What:** Allows users to record different income streams such as salaries, freelance work, interest and dividends.  Provides a timeline of income events and totals per month.

**Why:** Understanding total cash inflow is foundational to budgeting and financial planning.  Categorizing income helps users see the contribution of various sources and identify trends.

### 2.4 Expense Management

**What:** Lets users log everyday expenses and categorize them (food, transport, entertainment, etc.).  Offers a breakdown of spending by category and highlights unusual spikes.

**Why:** Budgeting requires visibility into where money goes.  Categorized expenses enable users to identify areas where they might overspend.  Insights can lead to more mindful spending habits.

### 2.5 Investment Monitoring

**What:** Provides an inventory of the user’s investments (stocks, mutual funds, fixed deposits, bonds).  Tracks purchase values and current market values, and displays returns over time.  Pulls live price data from third‑party market APIs.

**Why:** Many users maintain investments across multiple platforms and lose sight of their overall portfolio.  By consolidating them, Kosha gives an at‑a‑glance view of net worth and investment performance, aiding in rebalancing decisions.

### 2.6 Payments and UPI Integration

**What:** Enables users to pay bills directly from the app using UPI, credit/debit cards or net banking.  Supports setting up UPI Autopay mandates for recurring bills.  Records each payment with status and reference.

**Why:** Seamless payments mean fewer missed deadlines and no need to switch apps.  Autopay reduces manual effort for recurring bills while still allowing users to monitor and manage mandates.

### 2.7 Notifications and Reminders

**What:** Sends timely reminders ahead of bill due dates, notifications for successful or failed payments, and alerts for income or investment events.  Delivers messages via email, SMS or push notifications based on user preference.

**Why:** Proactive reminders minimize the chance of missed payments.  Confirmation notifications provide peace of mind after transactions.  Insights into income or investment changes keep users engaged with their finances.

### 2.8 Dashboard and Insights

**What:** A visual summary of the user’s financial status: upcoming bills, income vs expenses, spending by category and overall net worth.  Presents charts and trends to help users understand their financial health.

**Why:** A dashboard transforms raw data into actionable insights.  Seeing trends can motivate users to adjust their behavior, set goals and track progress toward financial objectives.

## 3. Next Steps and Folder Structure

To keep the project organized:

1. **Create a `spec/` directory** in the repository root.  Under it, maintain subfolders following the 6-layer architecture:
   - `spec/01-requirements/` – for business requirements describing what each feature does and why
   - `spec/02-narrative/` – for natural‑language specifications like this document, explaining the **what** and **why** of each feature.
   - `spec/03-architecture/` – for system architecture definitions
   - `spec/04-design/` – for technical design documents
   - `spec/05-technical/` – for code‑driven specs using spec‑kit DSL.  These define the **how**, including models and API actions.
   - `spec/06-backend/` – for detailed backend implementation specs
   - `spec/07-frontend/` – for frontend guidelines

2. Begin by refining the narratives for each feature in `spec/02-narrative/`, incorporating user stories and acceptance criteria.

3. Once narratives are stable, translate them into technical specs in `spec/05-technical/`.  This ensures that code generation remains aligned with the stated goals and rationale.

This separation makes it easy for non‑technical stakeholders to review the high‑level goals, while still enabling developers to generate code from precise specifications.
