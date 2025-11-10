"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExecutionMonitor, OrderExecutionStatus, ExchangeRoute } from "@/lib/types";
import { useState } from "react";

// Mock data - will be replaced with real API call
const mockExecutionMonitor: ExecutionMonitor = {
  id: "exec-001",
  recommendationId: "rec-001",
  orders: [
    {
      id: "ord-001",
      parentRecommendationId: "rec-001",
      asset: "BTC",
      side: "buy",
      totalAmount: 0.5,
      amountFilled: 0.35,
      averagePrice: 45000,
      status: "executing",
      strategy: "TWAP",
      totalChunks: 12,
      completedChunks: 8,
      startTime: new Date(Date.now() - 30 * 60000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 15 * 60000).toISOString(),
    },
    {
      id: "ord-002",
      parentRecommendationId: "rec-001",
      asset: "ETH",
      side: "buy",
      totalAmount: 5,
      amountFilled: 5,
      averagePrice: 3000,
      status: "completed",
      strategy: "TWAP",
      totalChunks: 12,
      completedChunks: 12,
      startTime: new Date(Date.now() - 60 * 60000).toISOString(),
      endTime: new Date(Date.now() - 10 * 60000).toISOString(),
    },
  ],
  exchangeRoutes: [
    {
      exchangeName: "Binance",
      percentage: 60,
      amount: 50000,
      status: "active",
    },
    {
      exchangeName: "Coinbase",
      percentage: 30,
      amount: 25000,
      status: "active",
    },
    {
      exchangeName: "Kraken",
      percentage: 10,
      amount: 8333,
      status: "completed",
    },
  ],
  totalSlippage: 0.18,
  maxSlippage: 0.25,
  avgExecutionPrice: 44500,
  expectedPrice: 44600,
  startTime: new Date(Date.now() - 60 * 60000).toISOString(),
  estimatedEndTime: new Date(Date.now() + 15 * 60000).toISOString(),
  status: "executing",
};

export default function ExecutionPage() {
  const [monitor, setMonitor] = useState<ExecutionMonitor>(mockExecutionMonitor);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status: OrderExecutionStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "routing":
        return <Activity className="h-4 w-4 animate-pulse" />;
      case "executing":
        return <Activity className="h-4 w-4 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderExecutionStatus) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "routing":
        return "bg-blue-500";
      case "executing":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
    }
  };

  const getRouteStatusColor = (status: ExchangeRoute["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "active":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const slippagePercentage = (monitor.totalSlippage / monitor.maxSlippage) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Execution Monitor</h1>
            <p className="text-muted-foreground">
              Real-time order execution tracking and smart routing
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        {/* Overall Status */}
        <Alert
          className={cn(
            monitor.status === "executing" &&
              "border-blue-500 bg-blue-50 dark:bg-blue-950"
          )}
        >
          <Activity className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            <Badge className={cn("text-white", getStatusColor(monitor.status))}>
              {getStatusIcon(monitor.status)}
              <span className="ml-1 capitalize">{monitor.status}</span>
            </Badge>
            Execution in Progress
          </AlertTitle>
          <AlertDescription>
            Started {new Date(monitor.startTime).toLocaleString()} • Estimated
            completion {new Date(monitor.estimatedEndTime).toLocaleString()}
          </AlertDescription>
        </Alert>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Smart Order Router
                </p>
                <p className="text-2xl font-bold">12 Orders</p>
                <p className="text-xs text-muted-foreground">TWAP 60min</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Slippage</p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    monitor.totalSlippage <= monitor.maxSlippage / 2
                      ? "text-success"
                      : monitor.totalSlippage <= monitor.maxSlippage
                      ? "text-warning"
                      : "text-danger"
                  )}
                >
                  {monitor.totalSlippage.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Max: {monitor.maxSlippage}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold">
                  ${monitor.avgExecutionPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected: ${monitor.expectedPrice.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Orders Progress</p>
                <p className="text-2xl font-bold">
                  {monitor.orders.filter((o) => o.status === "completed").length}/
                  {monitor.orders.length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Slippage Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Slippage Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Current Slippage</span>
              <span className="font-semibold">{monitor.totalSlippage}%</span>
            </div>
            <Progress value={slippagePercentage} />
            <p className="text-xs text-muted-foreground">
              Max: {monitor.maxSlippage}% • Fallback to market if timeout (5min)
            </p>
          </CardContent>
        </Card>

        {/* Exchange Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Selection - Smart Router</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitor.exchangeRoutes.map((route, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{route.exchangeName}</span>
                      <Badge
                        className={cn("text-white", getRouteStatusColor(route.status))}
                      >
                        {route.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{route.percentage}%</p>
                      <p className="text-xs text-muted-foreground">
                        ${route.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Progress value={route.percentage} />
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Orders are distributed across exchanges based on liquidity and fees
            </p>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Filled</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitor.orders.map((order) => {
                  const progress = (order.completedChunks / order.totalChunks) * 100;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.asset}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            order.side === "buy"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          )}
                        >
                          {order.side === "buy" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {order.side.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.strategy}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>
                              {order.completedChunks}/{order.totalChunks} chunks
                            </span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.amountFilled.toFixed(4)}/{order.totalAmount.toFixed(4)}
                      </TableCell>
                      <TableCell>${order.averagePrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn("text-white", getStatusColor(order.status))}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.status === "completed" && order.endTime
                          ? new Date(order.endTime).toLocaleTimeString()
                          : order.estimatedCompletion
                          ? `Est: ${new Date(
                              order.estimatedCompletion
                            ).toLocaleTimeString()}`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Type Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Execution Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
              <div>
                <p className="font-semibold">Order Type</p>
                <p className="text-muted-foreground">
                  Limit orders (mid + 0.05%) with 5min timeout
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
              <div>
                <p className="font-semibold">Smart Routing</p>
                <p className="text-muted-foreground">
                  Orders split into 12 chunks using TWAP over 60 minutes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
              <div>
                <p className="font-semibold">Exchange Distribution</p>
                <p className="text-muted-foreground">
                  Binance 60%, Coinbase 30%, Kraken 10% based on liquidity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
              <div>
                <p className="font-semibold">Slippage Control</p>
                <p className="text-muted-foreground">
                  Max 0.25% slippage, automatic fallback to market order if timeout
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

