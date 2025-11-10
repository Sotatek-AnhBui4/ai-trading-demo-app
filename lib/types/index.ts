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

// AI Recommendation Types
export type RecommendationAction = "REBALANCE" | "HOLD" | "BUY" | "SELL" | "EXIT_TO_STABLE";

export interface RecommendationChange {
  asset: string;
  from: number; // percentage
  to: number; // percentage
}

export interface AIRecommendation {
  id: string;
  action: RecommendationAction;
  changes: RecommendationChange[];
  reasoning: string[];
  confidence: number; // 0-1
  riskScore: number; // 0-10
  marketRegime: "bull" | "bear" | "chop";
  assetSignals: {
    asset: string;
    signal: "bullish" | "bearish" | "neutral";
  }[];
  timestamp: string;
  status: "pending" | "approved" | "rejected" | "executed";
}

// Rules Engine Validation Types
export interface RuleCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  message?: string;
  severity: "critical" | "warning" | "info";
}

export interface RulesValidationResult {
  id: string;
  recommendationId: string;
  allPassed: boolean;
  checks: RuleCheck[];
  timestamp: string;
  approved: boolean;
}

// Execution Mode Settings Types
export type ExecutionMode = "manual" | "auto";

export interface ExecutionSettings {
  mode: ExecutionMode;
  autoExecuteRebalancing: boolean;
  rebalancingFrequency: "daily" | "weekly" | "biweekly" | "monthly";
  autoStopLoss: boolean;
  stopLossType: "trailing" | "fixed";
  stopLossPercentage: number;
  autoTakeProfit: boolean;
  takeProfitWhenGoalReached: boolean;
  requireApprovalThreshold: number; // USD amount
  notificationsEnabled: boolean;
}

// Execution Monitor Types
export type OrderExecutionStatus = "pending" | "routing" | "executing" | "completed" | "failed" | "cancelled";

export interface ExecutionOrder {
  id: string;
  parentRecommendationId: string;
  asset: string;
  side: OrderSide;
  totalAmount: number;
  amountFilled: number;
  averagePrice: number;
  status: OrderExecutionStatus;
  strategy: "TWAP" | "VWAP" | "Smart";
  totalChunks: number;
  completedChunks: number;
  startTime: string;
  endTime?: string;
  estimatedCompletion?: string;
}

export interface ExchangeRoute {
  exchangeName: string;
  percentage: number;
  amount: number;
  status: "pending" | "active" | "completed" | "failed";
}

export interface ExecutionMonitor {
  id: string;
  recommendationId: string;
  orders: ExecutionOrder[];
  exchangeRoutes: ExchangeRoute[];
  totalSlippage: number; // percentage
  maxSlippage: number; // percentage
  avgExecutionPrice: number;
  expectedPrice: number;
  startTime: string;
  estimatedEndTime: string;
  status: OrderExecutionStatus;
}

// Post-Trade Monitoring Types
export type AlertSeverity = "info" | "warning" | "critical";

export interface TradingAlert {
  id: string;
  type: "drawdown" | "slippage" | "circuit_breaker" | "goal_milestone" | "risk_limit";
  severity: AlertSeverity;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
  acknowledged: boolean;
}

export interface CircuitBreakerStatus {
  enabled: boolean;
  triggered: boolean;
  threshold: number; // percentage
  currentDrawdown: number; // percentage
  lastChecked: string;
  actionTaken?: string;
}

export interface RealTimeTracking {
  currentPrice: Record<string, number>; // asset -> price
  currentPnL: number;
  currentPnLPct: number;
  currentDrawdown: number;
  maxDrawdown: number;
  lastUpdated: string;
}

export interface DailyReport {
  date: string;
  openingBalance: number;
  closingBalance: number;
  pnl: number;
  pnlPct: number;
  tradesExecuted: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio?: number;
  notes: string[];
}

