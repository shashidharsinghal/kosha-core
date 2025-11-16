# Investment Monitoring Integration Test Flows

This document defines integration test cases for investment monitoring flows, including investment tracking, live price updates, portfolio aggregation, and ROI calculations.

## Test Flow 1: Investment Asset Management

### Test Scenario
User adds investment assets, records buy/sell transactions, updates asset details, lists investments with holdings, and manages transaction history.

### Prerequisites
- User is registered and authenticated
- PostgreSQL database (test instance)
- Valid access token

### Test Steps

1. **Add Investment Asset**
   - **Action**: `POST /api/v1/investments/assets`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "symbol": "RELIANCE",
       "type": "STOCK",
       "name": "Reliance Industries Ltd",
       "institution": "NSE",
       "notes": "Long-term holding"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: Created asset object with `id`, `userId`, timestamps
   - **Assertions**:
     - Asset created in PostgreSQL
     - `userId` matches authenticated user
     - All fields stored correctly
     - `createdAt` and `updatedAt` set

2. **Add Buy Transaction**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/transactions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "transactionDate": "2024-01-15T00:00:00Z",
       "transactionType": "BUY",
       "units": 10,
       "pricePerUnit": 2500,
       "fees": 50,
       "totalAmount": 25050,
       "notes": "Initial purchase"
     }
     ```
   - **Expected Response**: `201 Created`
   - **Response Body**: Created transaction object
   - **Assertions**:
     - Transaction created in PostgreSQL
     - Transaction linked to asset
     - `totalAmount` calculated correctly (units * pricePerUnit + fees)
     - `userId` matches authenticated user

3. **Add Sell Transaction**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/transactions`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "transactionDate": "2024-02-20T00:00:00Z",
       "transactionType": "SELL",
       "units": 5,
       "pricePerUnit": 2600,
       "fees": 30,
       "totalAmount": 12970
     }
     ```
   - **Expected Response**: `201 Created`
   - **Assertions**:
     - Sell transaction created
     - Units reduced from holdings
     - Transaction linked to asset

4. **List Investments with Holdings**
   - **Action**: `GET /api/v1/investments?page=1&limit=20`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "investments": [
         {
           "asset": {...},
           "currentUnits": 5,
           "averageCost": 2505,
           "currentValue": 13000,
           "roi": 0.04
         }
       ],
       "total": 1,
       "page": 1,
       "limit": 20
     }
     ```
   - **Assertions**:
     - Current units calculated correctly (buy - sell)
     - Average cost calculated (weighted average)
     - Current value = currentUnits * currentPrice
     - ROI calculated correctly
     - Investments belong to authenticated user

5. **Update Asset Details**
   - **Action**: `PUT /api/v1/investments/assets/{assetId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "name": "Reliance Industries Limited",
       "notes": "Updated notes"
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Asset updated in database
     - Only specified fields updated
     - `updatedAt` timestamp changed

6. **Get Transaction History**
   - **Action**: `GET /api/v1/investments/transactions?assetId={assetId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: List of transactions for asset
   - **Assertions**:
     - All transactions for asset returned
     - Transactions sorted by date
     - Buy and sell transactions included

7. **Update Transaction**
   - **Action**: `PUT /api/v1/investments/transactions/{transactionId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Request Body**:
     ```json
     {
       "pricePerUnit": 2550,
       "totalAmount": 25550
     }
     ```
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Transaction updated
     - Holdings recalculated
     - Average cost updated

8. **Delete Transaction**
   - **Action**: `DELETE /api/v1/investments/transactions/{transactionId}`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Assertions**:
     - Transaction deleted
     - Holdings recalculated
     - Average cost updated

### Expected Results
- Asset and transaction CRUD operations work correctly
- Holdings calculated accurately
- Average cost computed correctly
- ROI calculations accurate
- User isolation maintained

### Edge Cases

1. **Invalid Transaction Data**
   - **Action**: Create transaction with negative units
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation errors returned

2. **Sell More Than Holdings**
   - **Action**: Sell more units than currently held
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Validation prevents negative holdings

3. **Update Non-existent Asset**
   - **Action**: Update asset with invalid ID
   - **Expected Response**: `404 Not Found`
   - **Assertions**: Error handling for missing assets

4. **Update Another User's Asset**
   - **Action**: Attempt to update asset belonging to different user
   - **Expected Response**: `403 Forbidden` or `404 Not Found`
   - **Assertions**: Authorization check works

5. **Multiple Assets Same Symbol**
   - **Scenario**: User adds same symbol from different exchanges
   - **Expected**: Both assets created separately
   - **Assertions**: Symbol uniqueness per user or per exchange

### Dependencies
- PostgreSQL database
- Authentication service
- Authorization middleware
- Transaction calculation service

---

## Test Flow 2: Live Price Updates and Portfolio Valuation

### Test Scenario
System fetches live prices for investment assets, updates portfolio values, calculates ROI, and tracks price history.

### Prerequisites
- User has investment assets
- Market data API configured (mock or real)
- PostgreSQL database with assets
- Background job processor (for scheduled updates)

### Test Steps

1. **Fetch Live Price for Asset**
   - **Action**: `POST /api/v1/investments/assets/{assetId}/fetch-price`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "currentValue": 13000,
       "price": 2600
     }
     ```
   - **Assertions**:
     - Live price fetched from market API
     - Price stored in `AssetPrice` table
     - Current value calculated (units * price)

2. **Verify Price Storage**
   - **Action**: Query `AssetPrice` table
   - **Assertions**:
     - Price record created with symbol, price, date
     - Source recorded (e.g., "NSE", "BSE", "ALPHA_VANTAGE")
     - Timestamp set correctly

3. **Get Price History**
   - **Action**: `GET /api/v1/investments/assets/{assetId}/price-history?startDate=2024-01-01&endDate=2024-03-31`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     [
       {"date": "2024-01-15", "price": 2500},
       {"date": "2024-02-01", "price": 2550},
       {"date": "2024-03-01", "price": 2600}
     ]
     ```
   - **Assertions**:
     - Historical prices returned
     - Date range filtering works
     - Prices sorted by date

4. **Calculate Portfolio Value**
   - **Action**: `GET /api/v1/investments/portfolio-summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**:
     ```json
     {
       "totalValue": 150000,
       "totalCost": 120000,
       "roi": 30000,
       "roiPercentage": 0.25,
       "byType": {
         "STOCK": 100000,
         "MUTUAL_FUND": 50000
       },
       "byAsset": [...]
     }
     ```
   - **Assertions**:
     - Total value = sum of (currentUnits * currentPrice) for all assets
     - Total cost = sum of (averageCost * currentUnits)
     - ROI = totalValue - totalCost
     - ROI percentage = (ROI / totalCost) * 100
     - Breakdown by type accurate
     - Top holdings listed

5. **Scheduled Price Updates**
   - **Action**: Background job runs (e.g., daily)
   - **Expected**: Prices updated for all assets
   - **Assertions**:
     - All assets have current prices
     - Portfolio values updated
     - Price history maintained

6. **Verify ROI Calculation**
   - **Action**: Compare calculated ROI with manual calculation
   - **Assertions**:
     - ROI = (currentValue - costBasis) / costBasis
     - Cost basis = averageCost * currentUnits
     - Calculations accurate

### Expected Results
- Live prices fetched successfully
- Price history maintained
- Portfolio values calculated correctly
- ROI calculations accurate
- Scheduled updates work

### Edge Cases

1. **Market API Failure**
   - **Scenario**: Market data API unavailable
   - **Expected**: Error handling, fallback to last known price
   - **Assertions**: System handles API failures gracefully

2. **Stale Price Data**
   - **Scenario**: Last price update was days ago
   - **Expected**: Stale price indicator or refresh trigger
   - **Assertions**: Stale data handling

3. **Market Holiday**
   - **Scenario**: Market closed, no price updates
   - **Expected**: Last trading day price used
   - **Assertions**: Holiday handling works

4. **Invalid Symbol**
   - **Scenario**: Asset with invalid or delisted symbol
   - **Expected**: Error notification or price unavailable
   - **Assertions**: Invalid symbol handling

5. **Price Split/Dividend**
   - **Scenario**: Stock split or dividend event
   - **Expected**: Holdings adjusted or transaction recorded
   - **Assertions**: Corporate actions handled

6. **Multiple Price Sources**
   - **Scenario**: Same asset from different exchanges
   - **Expected**: Prices from correct source
   - **Assertions**: Source selection works

### Dependencies
- Market data APIs (NSE, BSE, Alpha Vantage, etc.)
- PostgreSQL database
- Background job processor
- Price calculation service

---

## Test Flow 3: Investment-Dashboard Integration

### Test Scenario
Investment data is aggregated into dashboard summaries, net worth calculations, and investment growth trends are displayed.

### Prerequisites
- User has multiple investments
- Portfolio values calculated
- Dashboard service running
- PostgreSQL database with investment data

### Test Steps

1. **Create Investment Portfolio**
   - **Action**: Create multiple assets with transactions
   - **Examples**: Stocks, mutual funds, fixed deposits
   - **Assertions**: Portfolio data stored

2. **Get Dashboard Summary**
   - **Action**: `GET /api/v1/dashboard/summary`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Dashboard summary including investment data
   - **Assertions**:
     - Investment value included
     - Net worth calculation includes investments
     - Investment breakdown available

3. **Verify Net Worth Calculation**
   - **Action**: Compare dashboard net worth with manual calculation
   - **Calculation**: Net worth = investments + cash - liabilities
   - **Assertions**:
     - Investment value included correctly
     - Net worth accurate
     - All components included

4. **Get Investment Growth Trends**
   - **Action**: `GET /api/v1/dashboard/trends?period=MONTH&metric=INVESTMENT`
   - **Headers**: `Authorization: Bearer {accessToken}`
   - **Expected Response**: `200 OK`
   - **Response Body**: Investment value trends over time
   - **Assertions**:
     - Trend data matches portfolio values
     - Monthly aggregation correct
     - Growth visible over time

5. **Verify Portfolio Summary in Dashboard**
   - **Action**: Compare dashboard investment data with portfolio summary
   - **Assertions**:
     - Investment totals match
     - ROI displayed correctly
     - Asset allocation shown
     - Data consistency maintained

6. **Real-time Portfolio Updates**
   - **Action**: Add new investment transaction
   - **Action**: Refresh dashboard
   - **Expected**: Dashboard reflects new investment
   - **Assertions**:
     - Cache invalidation works (if caching)
     - Dashboard updates with new data
     - Net worth recalculated

### Expected Results
- Investment data accurately aggregated in dashboard
- Net worth calculations include investments
- Investment trends display correctly
- Real-time updates work
- Data consistency maintained

### Edge Cases

1. **No Investments**
   - **Scenario**: User has no investments
   - **Expected**: Dashboard shows zero investment value
   - **Assertions**: Handles empty data gracefully

2. **Negative ROI**
   - **Scenario**: Investments with losses
   - **Expected**: Negative ROI displayed correctly
   - **Assertions**: Negative values handled

3. **Unpriced Assets**
   - **Scenario**: Assets without current price
   - **Expected**: Last known price or "N/A" indicator
   - **Assertions**: Missing price handling

4. **Large Portfolio**
   - **Scenario**: User has many investments
   - **Expected**: Performance acceptable, all assets included
   - **Assertions**: Efficient aggregation

5. **Price Update During Calculation**
   - **Scenario**: Price updates while dashboard calculated
   - **Expected**: Consistent snapshot or real-time update
   - **Assertions**: Consistency handling

### Dependencies
- Investment monitoring service
- Dashboard service
- Portfolio calculation service
- PostgreSQL database
- Cache service (optional)

---

## Test Flow 4: Multiple Asset Types Management

### Test Scenario
User manages different types of investments (stocks, mutual funds, fixed deposits, bonds, gold, crypto) with appropriate calculations for each type.

### Prerequisites
- User is registered and authenticated
- PostgreSQL database
- Market data APIs for different asset types

### Test Steps

1. **Add Stock Investment**
   - **Action**: Create asset with type "STOCK"
   - **Assertions**: Stock asset created, price tracking enabled

2. **Add Mutual Fund Investment**
   - **Action**: Create asset with type "MUTUAL_FUND"
   - **Assertions**: Mutual fund asset created, NAV tracking enabled

3. **Add Fixed Deposit**
   - **Action**: Create asset with type "FIXED_DEPOSIT"
   - **Request Body**:
     ```json
     {
       "type": "FIXED_DEPOSIT",
       "name": "HDFC Bank FD",
       "amount": 100000,
       "interestRate": 6.5,
       "maturityDate": "2025-12-31"
     }
     ```
   - **Assertions**: Fixed deposit created, maturity tracking enabled

4. **Add Gold Investment**
   - **Action**: Create asset with type "GOLD"
   - **Assertions**: Gold asset created, gold price tracking enabled

5. **Add Crypto Investment**
   - **Action**: Create asset with type "CRYPTO"
   - **Assertions**: Crypto asset created, crypto price tracking enabled

6. **Verify Type-Specific Calculations**
   - **Action**: Get portfolio summary
   - **Assertions**:
     - Each asset type calculated correctly
     - Type-specific metrics included
     - Portfolio breakdown by type accurate

7. **Filter by Asset Type**
   - **Action**: `GET /api/v1/investments?type=STOCK`
   - **Expected**: Only stock investments returned
   - **Assertions**: Type filtering works

### Expected Results
- All asset types supported
- Type-specific calculations accurate
- Portfolio aggregation includes all types
- Filtering by type works

### Edge Cases

1. **Unsupported Asset Type**
   - **Action**: Create asset with invalid type
   - **Expected Response**: `400 Bad Request`
   - **Assertions**: Type validation works

2. **Mixed Asset Portfolio**
   - **Scenario**: Portfolio with all asset types
   - **Expected**: All types aggregated correctly
   - **Assertions**: Mixed portfolio handling

3. **Type-Specific Price Sources**
   - **Scenario**: Different price sources for different types
   - **Expected**: Correct source used for each type
   - **Assertions**: Source selection works

### Dependencies
- Investment monitoring service
- Multiple market data APIs
- PostgreSQL database
- Type-specific calculation services

---

## Test Flow 5: Complete Investment Monitoring Lifecycle

### Test Scenario
End-to-end flow: Add assets → Record transactions → Fetch prices → Calculate portfolio → View in dashboard → Track ROI.

### Prerequisites
- User with authentication
- All services running
- Market data APIs configured
- Complete test environment

### Test Steps

1. Add investment assets (multiple types)
2. Record buy transactions
3. Fetch live prices
4. Calculate portfolio value and ROI
5. Record sell transactions
6. Update portfolio calculations
7. View investment data in dashboard
8. Track price history and trends

### Expected Results
- Complete investment lifecycle works seamlessly
- All calculations accurate
- Dashboard integration works
- Price tracking functions
- Data consistency maintained

### Edge Cases
- Price fetch failures
- Calculation errors
- Transaction validation issues
- Dashboard sync problems

### Dependencies
- All investment monitoring services
- Market data APIs
- Dashboard service
- Background jobs
- Calculation services

