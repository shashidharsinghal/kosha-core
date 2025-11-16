# Investment Monitoring – Technical Specification

## Technical Overview

The investment monitoring module tracks user portfolios across various asset classes (mutual funds, stocks, bonds, gold, crypto).  It stores each transaction (buy/sell) and calculates current value, ROI and growth trends by fetching live prices from external APIs.  Because investment data often requires relational queries (e.g., summing holdings by asset and joining with price history), this feature uses a relational database and performs analytical queries via SQL.

### Data Model & Database Choice

Investments involve complex relationships—multiple transactions per asset, price histories, and calculations across assets.  A comparison between Postgres and MongoDB notes that **Postgres is better suited for applications with complex business logic and queries**【163388115766043†L297-L302】.  Therefore we use **PostgreSQL** for the investment module.  Core tables:

* **assets**: `id (PK UUID)`, `user_id`, `symbol`, `type` (`STOCK`, `MUTUAL_FUND`, `CRYPTO`, `GOLD`), `name`.  
* **asset_transactions**: `id (PK UUID)`, `asset_id (FK)`, `transaction_date`, `transaction_type` (`BUY`, `SELL`), `units`, `price_per_unit`, `fees`, `created_at`.  
* **asset_prices**: `id (PK)`, `symbol`, `price`, `date` – daily price feed from external APIs.  
* **portfolio_snapshots** (optional): precomputed snapshots for fast dashboards.

Indexes on `asset_id` and `symbol,date` optimize queries for holdings and price lookups.  Transactions are associated via foreign keys to ensure referential integrity.

### REST API Endpoints

* `GET /api/v1/investments` – List all assets for the user, aggregated with current value and ROI.  
* `POST /api/v1/investments` – Add a new asset transaction (buy/sell).  
* `PATCH /api/v1/investments/:transactionId` – Edit a transaction (quantity, price) before settlement.  
* `DELETE /api/v1/investments/:transactionId` – Remove a transaction.  
* `GET /api/v1/investments/:symbol/prices` – Get historical prices for an asset (for charts).  
* `GET /api/v1/investments/summary` – Retrieve portfolio overview (total value, ROI, asset allocation).  

Endpoints follow proper HTTP verb usage and naming conventions【8357684761619†L134-L149】 and return appropriate status codes【8357684761619†L152-L162】.

### External Integrations

* **Price Feeds:** Integrate with financial data providers (e.g., Alpha Vantage, NSE, BSE) to fetch live prices and daily price history; store results in `asset_prices`.  
* **Corporate Actions:** For splits/dividends, update transaction records and adjust unit counts accordingly.  
* **Gold & Crypto APIs:** Fetch real‑time rates for gold and crypto assets.

### Implementation Tasks

1. **Design PostgreSQL schema** with `assets`, `asset_transactions`, `asset_prices` tables; create migrations and indexes.  
2. **Develop services** for portfolio calculations (current value, ROI), transaction validation (e.g., cannot sell more units than owned) and integration with price feeds.  
3. **Implement controllers** for API endpoints; handle queries, transformations and responses.  
4. **Build price ingestion workers** to call external APIs on a scheduled basis and populate `asset_prices`.  
5. **Implement business logic** to handle corporate actions like splits and dividends; adjust transactions accordingly.  
6. **Cache computed portfolio summaries** (e.g., total value) in Redis and update on relevant changes.  
7. **Write integration and unit tests** verifying calculation accuracy, API behaviour and price feed handling; use a realistic test environment and clear test case design as recommended【551007709182127†L435-L475】.

## Acceptance Tests

* **Add Investment Transaction:** Posting a valid transaction records it and updates the user’s holdings; invalid requests return appropriate errors (`400 Bad Request` for missing fields, `422 Unprocessable Entity` if selling too many units).  
* **Fetch Portfolio Summary:** Returns accurate total value, ROI and allocation breakdown based on stored transactions and latest prices.  
* **Price Feed Integration:** Scheduled worker fetches price data and populates `asset_prices`; missing or stale prices are handled gracefully.  
* **Split & Dividend Handling:** When a split occurs, the module adjusts units and price per unit; dividends update ROI calculations correctly.  
* **Edit & Delete Transactions:** Editing or deleting a transaction correctly recalculates holdings and summary values; invalid transaction IDs return `404 Not Found`.

These tests cover the complex flows of investment monitoring and ensure reliability before production, adhering to the importance of clear requirements and thorough acceptance testing【551007709182127†L435-L475】.