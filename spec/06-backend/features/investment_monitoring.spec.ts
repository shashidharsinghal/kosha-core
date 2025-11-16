/*
 * Investment Monitoring feature specification.
 * Defines Asset, AssetTransaction, and AssetPrice models for tracking investments with normalized structure.
 * Uses PostgreSQL for complex queries, joins, and ACID guarantees required for portfolio calculations.
 */

feature("InvestmentMonitoring", () => {
  // Represents an investment asset (stock, mutual fund, etc.)
  model("Asset", () => {
    field("id", "string" /* UUID */);
    field("userId", "string");
    field("symbol", "string"); // e.g. "AAPL", "RELIANCE", "SBI_MF_123"
    field("type", enum("MUTUAL_FUND", "STOCK", "FIXED_DEPOSIT", "BOND", "GOLD", "CRYPTO", "OTHER"));
    field("name", "string");
    field("institution", "string", { optional: true });
    field("notes", "string", { optional: true });
    field("createdAt", "datetime");
    field("updatedAt", "datetime");
  });

  // Represents a buy/sell transaction for an asset
  model("AssetTransaction", () => {
    field("id", "string" /* UUID */);
    field("assetId", "string"); // FK to Asset
    field("userId", "string");
    field("transactionDate", "datetime");
    field("transactionType", enum("BUY", "SELL"));
    field("units", "decimal");
    field("pricePerUnit", "decimal");
    field("fees", "decimal", { optional: true, default: 0 });
    field("totalAmount", "decimal"); // units * pricePerUnit + fees
    field("notes", "string", { optional: true });
    field("createdAt", "datetime");
  });

  // Represents historical price data for an asset
  model("AssetPrice", () => {
    field("id", "string" /* UUID */);
    field("symbol", "string");
    field("price", "decimal");
    field("date", "datetime");
    field("source", "string", { optional: true }); // e.g. "ALPHA_VANTAGE", "NSE", "BSE"
    field("createdAt", "datetime");
  });

  // Add a new asset
  action("addAsset", () => {
    param("asset", "Asset");
    returns("Asset");
  });

  // Update asset details
  action("updateAsset", () => {
    param("assetId", "string");
    param("asset", "Asset");
    returns("Asset");
  });

  // Add a transaction (buy/sell) for an asset
  action("addTransaction", () => {
    param("transaction", "AssetTransaction");
    returns("AssetTransaction");
  });

  // Update a transaction (before settlement)
  action("updateTransaction", () => {
    param("transactionId", "string");
    param("transaction", "AssetTransaction");
    returns("AssetTransaction");
  });

  // Delete a transaction
  action("deleteTransaction", () => {
    param("transactionId", "string");
    returns({ success: "boolean" });
  });

  // List all assets for a user with aggregated holdings
  action("listInvestments", () => {
    param("userId", "string");
    param("type", enum("MUTUAL_FUND", "STOCK", "FIXED_DEPOSIT", "BOND", "GOLD", "CRYPTO", "OTHER"), { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ 
      investments: [{
        asset: "Asset",
        currentUnits: "decimal",
        averageCost: "decimal",
        currentValue: "decimal",
        roi: "decimal"
      }], 
      total: "number", 
      page: "number", 
      limit: "number" 
    });
  });

  // Fetch live price data from an external market data API
  action("fetchLivePrice", () => {
    param("assetId", "string");
    param("symbol", "string", { optional: true });
    returns({ currentValue: "decimal", price: "decimal" });
  });

  // Get portfolio summary (total value, ROI, asset allocation)
  action("getPortfolioSummary", () => {
    param("userId", "string");
    returns({ 
      totalValue: "decimal", 
      totalCost: "decimal", 
      roi: "decimal", 
      roiPercentage: "decimal",
      byType: "object", // breakdown by asset type
      byAsset: ["object"] // top holdings
    });
  });

  // Get historical price data for an asset
  action("getPriceHistory", () => {
    param("assetId", "string");
    param("symbol", "string", { optional: true });
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    returns([{ date: "datetime", price: "decimal" }]);
  });

  // Get transaction history for an asset
  action("getTransactionHistory", () => {
    param("assetId", "string", { optional: true });
    param("userId", "string");
    param("startDate", "datetime", { optional: true });
    param("endDate", "datetime", { optional: true });
    param("transactionType", enum("BUY", "SELL"), { optional: true });
    param("page", "number", { optional: true, default: 1 });
    param("limit", "number", { optional: true, default: 20 });
    returns({ transactions: ["AssetTransaction"], total: "number", page: "number", limit: "number" });
  });
});