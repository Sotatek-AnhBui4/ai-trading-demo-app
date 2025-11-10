// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountStatus: "active" | "inactive" | "suspended";
  kycStatus: "pending" | "verified" | "rejected";
  amlStatus: "clear" | "flagged" | "under_review";
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Risk Control Types
export type RiskLevel = "conservative" | "moderate" | "aggressive";

export interface RiskConfig {
  id: string;
  name: string;
  perAssetCap: number; // Max % (e.g., 20 for 20%)
  sectorCap: number; // Max % (e.g., 40 for 40%)
  maxDailyVaR: number; // % (e.g., 2 for 2%)
  maxDrawdown: number; // % (e.g., 3 for 3%)
  maxSlippage: number; // % (e.g., 0.25 for 0.25%)
  stablecoinBuffer: number; // % (e.g., 10-15%)
  whitelist: string[]; // Allowed assets
  blacklist: string[]; // Forbidden assets
  spotOnly: boolean;
  leverageEnabled: boolean;
  futuresEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Signal Types
export type SignalLabel = "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
export type TimeHorizon = "1D" | "1W" | "1M";

export interface SignalReason {
  text: string;
  source?: string;
  sourceUrl?: string;
}

export interface Signal {
  id: string;
  asset: "BTC" | "ETH";
  label: SignalLabel;
  probUp: number; // Probability of price increase (0-1)
  expectedMovePct: number; // Expected move percentage
  confidence: number; // Confidence score (0-1)
  horizon: TimeHorizon;
  reasons: SignalReason[];
  riskFlags: string[];
  timestamp: string;
}

// Goal Planning Types
export interface GoalConstraints {
  spotOnly: boolean;
  maxAssetWeightPct: number;
  maxDrawdownPct: number;
  maxDailyVarPct: number;
  blacklist: string[];
  whitelist: string[];
}

export interface AssetAllocation {
  asset: string;
  weight: number; // Percentage (0-100)
  amount?: number; // Amount in USD
}

export interface StopLoss {
  asset: string;
  type: "trailing" | "fixed";
  valuePct: number;
}

export interface CircuitBreaker {
  toStableOnDrawdownPct: number;
  enabled: boolean;
}

export interface GoalPlan {
  allocations: AssetAllocation[];
  exec: {
    style: "TWAP" | "VWAP" | "Smart";
    rebalanceHours: number;
  };
  stops: StopLoss[];
  circuitBreakers: CircuitBreaker;
}

export type GoalStatus = "active" | "completed" | "paused" | "cancelled";
export type TrackingStatus = "on-track" | "behind" | "ahead";

export interface Goal {
  id: string;
  capitalUsd: number;
  targetReturnPct: number;
  horizonDays: number;
  riskProfile: RiskLevel;
  constraints: GoalConstraints;
  plan: GoalPlan;
  probToHit: number; // Probability to hit target (0-1)
  currentReturnPct: number;
  trackingStatus: TrackingStatus;
  status: GoalStatus;
  explain: string[];
  createdAt: string;
  updatedAt: string;
}

// Exchange & Balance Types
export interface Balance {
  asset: string;
  available: number;
  allocated: number;
  total: number;
  valueUsd: number;
}

export interface MarketPair {
  symbol: string; // e.g., "BTC/USDT"
  baseAsset: string; // e.g., "BTC"
  quoteAsset: string; // e.g., "USDT"
  currentPrice: number;
  change24h: number; // Percentage
  volume24h: number;
  lastUpdated: string;
}

export interface ExchangeAccount {
  id: string;
  exchangeName: string;
  apiKeyStatus: "connected" | "disconnected" | "error";
  balances: Balance[];
  totalValueUsd: number;
  lastSynced: string;
}

// Trading History Types
export type OrderType = "market" | "limit" | "stop_loss" | "take_profit";
export type OrderSide = "buy" | "sell";
export type OrderStatus = "pending" | "partial" | "filled" | "cancelled" | "rejected";

export interface Order {
  id: string;
  asset: string;
  type: OrderType;
  side: OrderSide;
  amount: number;
  price: number;
  filled: number;
  remaining: number;
  status: OrderStatus;
  totalValue: number;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  orderId: string;
  asset: string;
  side: OrderSide;
  amount: number;
  executionPrice: number;
  totalValue: number;
  fee: number;
  pnl: number;
  timestamp: string;
}

export interface BalanceHistory {
  timestamp: string;
  totalValueUsd: number;
  pnlPct: number;
  pnlUsd: number;
}

// Dashboard Stats Types
export interface PortfolioStats {
  totalBalance: number;
  totalPnL: number;
  totalPnLPct: number;
  dailyVaR: number;
  currentDrawdown: number;
  allocation: AssetAllocation[];
}

// Execution & Pre-trade Check Types
export interface PreTradeCheck {
  name: string;
  passed: boolean;
  message?: string;
}

export interface PreTradeCheckResult {
  allPassed: boolean;
  checks: PreTradeCheck[];
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Filter Types
export interface TradeHistoryFilters {
  startDate?: string;
  endDate?: string;
  asset?: string;
  side?: OrderSide;
  status?: OrderStatus;
}

