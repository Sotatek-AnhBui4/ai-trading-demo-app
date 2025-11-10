"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertSeverity,
  CircuitBreakerStatus,
  DailyReport,
  RealTimeTracking,
  TradingAlert,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle,
  Download,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock data
const mockAlerts: TradingAlert[] = [
  {
    id: "alert-001",
    type: "drawdown",
    severity: "warning",
    message: "Drawdown reached 2.5% (warning threshold)",
    details: { currentDrawdown: 2.5, threshold: 2.5 },
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-002",
    type: "slippage",
    severity: "info",
    message: "Unusual slippage detected on BTC order (0.3%)",
    details: { asset: "BTC", slippage: 0.3 },
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    acknowledged: true,
  },
];

const mockCircuitBreaker: CircuitBreakerStatus = {
  enabled: true,
  triggered: false,
  threshold: 3,
  currentDrawdown: 2.5,
  lastChecked: new Date().toISOString(),
};

const mockRealTimeTracking: RealTimeTracking = {
  currentPrice: {
    BTC: 45123,
    ETH: 3012,
  },
  currentPnL: 2450,
  currentPnLPct: 2.45,
  currentDrawdown: 2.5,
  maxDrawdown: 3,
  lastUpdated: new Date().toISOString(),
};

const mockDailyReport: DailyReport = {
  date: new Date().toISOString().split("T")[0],
  openingBalance: 100000,
  closingBalance: 102450,
  pnl: 2450,
  pnlPct: 2.45,
  tradesExecuted: 8,
  winRate: 62.5,
  maxDrawdown: 1.2,
  sharpeRatio: 1.8,
  notes: [
    "Strong performance in BTC and ETH",
    "Rebalancing executed successfully",
    "All risk limits maintained",
  ],
};

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<TradingAlert[]>(mockAlerts);
  const [circuitBreaker] = useState<CircuitBreakerStatus>(mockCircuitBreaker);
  const [tracking] = useState<RealTimeTracking>(mockRealTimeTracking);
  const [dailyReport] = useState<DailyReport>(mockDailyReport);
  const [isLoading, setIsLoading] = useState(false);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const drawdownPercentage =
    (tracking.currentDrawdown / tracking.maxDrawdown) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Post-Trade Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time tracking, alerts, and performance monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw
                className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Unacknowledged Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <Alert variant="destructive">
            <Bell className="h-4 w-4" />
            <AlertTitle>
              {unacknowledgedAlerts.length} Unacknowledged Alert
              {unacknowledgedAlerts.length > 1 ? "s" : ""}
            </AlertTitle>
            <AlertDescription>
              Please review and acknowledge pending alerts
            </AlertDescription>
          </Alert>
        )}

        {/* Real-Time Tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />⚡ Real-Time
                Tracking
              </CardTitle>
              <Badge variant="outline">
                Live • Updated{" "}
                {new Date(tracking.lastUpdated).toLocaleTimeString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Prices */}
            <div>
              <h3 className="mb-3 font-semibold">Current Prices</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(tracking.currentPrice).map(([asset, price]) => (
                  <Card key={asset}>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{asset}</p>
                        <p className="text-2xl font-bold">
                          ${price.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* P&L */}
            <div>
              <h3 className="mb-3 font-semibold">Profit & Loss</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Current P&L (USD)
                      </p>
                      <p
                        className={cn(
                          "text-3xl font-bold",
                          tracking.currentPnL >= 0
                            ? "text-success"
                            : "text-danger"
                        )}
                      >
                        {tracking.currentPnL >= 0 ? "+" : ""}$
                        {tracking.currentPnL.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Current P&L (%)
                      </p>
                      <p
                        className={cn(
                          "text-3xl font-bold",
                          tracking.currentPnLPct >= 0
                            ? "text-success"
                            : "text-danger"
                        )}
                      >
                        {tracking.currentPnLPct >= 0 ? "+" : ""}
                        {tracking.currentPnLPct.toFixed(2)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Drawdown */}
            <div>
              <h3 className="mb-3 font-semibold">Drawdown Tracking</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Drawdown</span>
                  <span
                    className={cn(
                      "font-semibold",
                      tracking.currentDrawdown < tracking.maxDrawdown / 2
                        ? "text-success"
                        : tracking.currentDrawdown < tracking.maxDrawdown
                        ? "text-warning"
                        : "text-danger"
                    )}
                  >
                    {tracking.currentDrawdown.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={drawdownPercentage}
                  className={cn(
                    drawdownPercentage > 80 && "[&>div]:bg-red-500",
                    drawdownPercentage > 60 &&
                      drawdownPercentage <= 80 &&
                      "[&>div]:bg-yellow-500"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Max allowed: {tracking.maxDrawdown}% • Auto alert if &gt; 2.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Breaker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              ⚠️ Circuit Breaker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Status</p>
                <p className="text-sm text-muted-foreground">
                  Auto exit if drawdown = {circuitBreaker.threshold}%
                </p>
              </div>
              <Badge
                className={cn(
                  "text-white",
                  circuitBreaker.triggered ? "bg-red-500" : "bg-green-500"
                )}
              >
                {circuitBreaker.triggered ? (
                  <>
                    <XCircle className="mr-1 h-4 w-4" />
                    TRIGGERED
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    ACTIVE
                  </>
                )}
              </Badge>
            </div>

            {circuitBreaker.triggered && circuitBreaker.actionTaken && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Circuit Breaker Triggered</AlertTitle>
                <AlertDescription>
                  {circuitBreaker.actionTaken}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Drawdown</p>
                <p className="text-lg font-semibold">
                  {circuitBreaker.currentDrawdown}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Threshold</p>
                <p className="text-lg font-semibold">
                  {circuitBreaker.threshold}%
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Last checked:{" "}
              {new Date(circuitBreaker.lastChecked).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Auto Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Auto Alerts
              </CardTitle>
              {unacknowledgedAlerts.length > 0 && (
                <Badge variant="destructive">
                  {unacknowledgedAlerts.length} New
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No alerts at this time
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4",
                      !alert.acknowledged && "border-l-4 border-l-yellow-500"
                    )}
                  >
                    <div className="mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-white",
                            getSeverityColor(alert.severity)
                          )}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {alert.type.replace("_", " ")}
                        </Badge>
                        {!alert.acknowledged && (
                          <Badge variant="destructive">Unacknowledged</Badge>
                        )}
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📊 Daily Report</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {new Date(dailyReport.date).toLocaleDateString()}
                </Badge>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-lg font-semibold">
                  ${dailyReport.openingBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closing Balance</p>
                <p className="text-lg font-semibold">
                  ${dailyReport.closingBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P&L</p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    dailyReport.pnl >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {dailyReport.pnl >= 0 ? "+" : ""}$
                  {dailyReport.pnl.toLocaleString()} (
                  {dailyReport.pnlPct.toFixed(2)}
                  %)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trades Executed</p>
                <p className="text-lg font-semibold">
                  {dailyReport.tradesExecuted}
                </p>
              </div>
            </div>

            <Separator />

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-lg font-semibold">{dailyReport.winRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-lg font-semibold">
                  {dailyReport.maxDrawdown}%
                </p>
              </div>
              {dailyReport.sharpeRatio && (
                <div>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-lg font-semibold">
                    {dailyReport.sharpeRatio.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {dailyReport.notes.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="mb-2 font-semibold">Notes</p>
                  <ul className="space-y-1 text-sm">
                    {dailyReport.notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <Separator />

            <p className="text-xs text-muted-foreground">
              Performance summary sent daily at 8 PM
            </p>
          </CardContent>
        </Card>

        {/* Monitoring Info */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              About Post-Trade Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4" />
              <p>
                <strong>Real-time Tracking:</strong> Price, PnL, and drawdown
                updated in real-time
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4" />
              <p>
                <strong>Auto Alerts:</strong> Triggered when drawdown &gt; 2.5%
                or unusual slippage detected
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4" />
              <p>
                <strong>Circuit Breaker:</strong> Automatically exits to
                stablecoins if drawdown reaches 3%
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4" />
              <p>
                <strong>Daily Report:</strong> Comprehensive performance summary
                sent at 8 PM daily
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
