"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceChart } from "@/components/charts/PriceChart";
import { useExchangeStore } from "@/lib/stores/useExchangeStore";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function ExchangePage() {
  const { account, marketPairs, isLoading } = useExchangeStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-danger" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exchange & Balance</h1>
            <p className="text-muted-foreground">
              View your account balance and market data
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Exchange Account Status */}
        {isLoading ? (
          <Skeleton className="h-32" />
        ) : account ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Account Status</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(account.apiKeyStatus)}
                  <Badge
                    variant={
                      account.apiKeyStatus === "connected"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {account.apiKeyStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Exchange</p>
                  <p className="text-lg font-semibold">
                    {account.exchangeName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-semibold">
                    ${account.totalValueUsd.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Synced</p>
                  <p className="text-lg font-semibold">
                    {new Date(account.lastSynced).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Balances */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Balances</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : account && account.balances.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {account.balances.map((balance) => (
                <Card key={balance.asset}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {balance.asset}
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold">
                          {balance.total.toLocaleString(undefined, {
                            maximumFractionDigits: 8,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ≈ ${balance.valueUsd.toLocaleString()}
                        </p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Available</p>
                          <p className="font-medium">
                            {balance.available.toLocaleString(undefined, {
                              maximumFractionDigits: 8,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Allocated</p>
                          <p className="font-medium">
                            {balance.allocated.toLocaleString(undefined, {
                              maximumFractionDigits: 8,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No balance data available
              </CardContent>
            </Card>
          )}
        </div>

        {/* Market Pairs */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Market Pairs</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : marketPairs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {marketPairs.map((pair) => {
                const isPositive = pair.change24h >= 0;
                return (
                  <Card key={pair.symbol}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{pair.symbol}</CardTitle>
                        <Badge
                          className={cn(
                            isPositive
                              ? "bg-success text-success-foreground"
                              : "bg-danger text-danger-foreground"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {isPositive ? "+" : ""}
                          {pair.change24h.toFixed(2)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          ${pair.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          {pair.quoteAsset}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">24h Volume</p>
                          <p className="font-semibold">
                            ${(pair.volume24h / 1000000).toFixed(2)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Updated</p>
                          <p className="font-semibold">
                            {new Date(pair.lastUpdated).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Price Chart Placeholder - would need price history data */}
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-center text-sm text-muted-foreground">
                          Price chart will be displayed here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No market pairs available
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pre-trade Checks Info */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-trade Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Before executing any trade, the following checks are performed:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                <span>KYC and AML verification status</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                <span>Asset whitelist/blacklist compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                <span>
                  Risk limit validation (VaR, drawdown, per-asset cap)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                <span>Exchange connectivity and API status</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
