"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";
import { Order, Trade } from "@/lib/types";
import { Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function HistoryPage() {
  const { orders, trades, balanceHistory, filters, setFilters, isLoading } =
    useHistoryStore();

  const getOrderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "filled":
        return <Badge className="bg-success">Filled</Badge>;
      case "partial":
        return <Badge variant="secondary">Partial</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSideBadge = (side: "buy" | "sell") => {
    return (
      <Badge
        className={cn(
          side === "buy"
            ? "bg-success text-success-foreground"
            : "bg-danger text-danger-foreground"
        )}
      >
        {side.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">History</h1>
            <p className="text-muted-foreground">
              View your trading history and balance changes
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="balance">Balance History</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
          </TabsList>

          {/* Balance History Tab */}
          <TabsContent value="balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px]" />
                ) : balanceHistory.length > 0 ? (
                  <BalanceChart data={balanceHistory} />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No balance history available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Balance History Table */}
            {balanceHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Total Value (USD)</TableHead>
                        <TableHead>P&L (USD)</TableHead>
                        <TableHead>P&L (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceHistory.slice(0, 10).map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {format(new Date(item.timestamp), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${item.totalValueUsd.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-medium",
                                item.pnlUsd >= 0 ? "text-success" : "text-danger"
                              )}
                            >
                              {item.pnlUsd >= 0 ? "+" : ""}$
                              {item.pnlUsd.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-medium",
                                item.pnlPct >= 0 ? "text-success" : "text-danger"
                              )}
                            >
                              {item.pnlPct >= 0 ? "+" : ""}
                              {item.pnlPct.toFixed(2)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <CardTitle className="text-base">Filters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asset</label>
                    <Select
                      value={filters.asset || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          asset: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          status: value === "all" ? undefined : (value as Order["status"]),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="filled">Filled</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        setFilters({ startDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) => setFilters({ endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8">
                    <Skeleton className="h-96" />
                  </div>
                ) : orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Filled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(order.createdAt), "MM/dd HH:mm")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.asset}
                          </TableCell>
                          <TableCell className="capitalize">
                            {order.type}
                          </TableCell>
                          <TableCell>{getSideBadge(order.side)}</TableCell>
                          <TableCell>{order.amount.toFixed(8)}</TableCell>
                          <TableCell>
                            ${order.price.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {((order.filled / order.amount) * 100).toFixed(0)}%
                          </TableCell>
                          <TableCell>
                            {getOrderStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${order.totalValue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-96 items-center justify-center text-muted-foreground">
                    No orders found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades" className="space-y-4">
            {/* Filters - similar to orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <CardTitle className="text-base">Filters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asset</label>
                    <Select
                      value={filters.asset || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          asset: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Side</label>
                    <Select
                      value={filters.side || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          side: value === "all" ? undefined : (value as "buy" | "sell"),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        setFilters({ startDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) => setFilters({ endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trades Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8">
                    <Skeleton className="h-96" />
                  </div>
                ) : trades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Execution Price</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(trade.timestamp), "MM/dd HH:mm")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {trade.asset}
                          </TableCell>
                          <TableCell>{getSideBadge(trade.side)}</TableCell>
                          <TableCell>{trade.amount.toFixed(8)}</TableCell>
                          <TableCell>
                            ${trade.executionPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${trade.totalValue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            ${trade.fee.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-medium",
                                trade.pnl >= 0 ? "text-success" : "text-danger"
                              )}
                            >
                              {trade.pnl >= 0 ? "+" : ""}$
                              {trade.pnl.toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-96 items-center justify-center text-muted-foreground">
                    No trades found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

