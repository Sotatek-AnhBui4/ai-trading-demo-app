"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignalStore } from "@/lib/stores/useSignalStore";
import { useSignalData } from "@/hooks/useSignalData";
import { Signal, TimeHorizon } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SignalsPage() {
  // Load signal data
  useSignalData();

  const {
    signals,
    selectedHorizon,
    setSelectedHorizon,
    isLoading,
    lastUpdated,
  } = useSignalStore();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredSignals = signals.filter((s) => s.horizon === selectedHorizon);

  const getSignalIcon = (label: Signal["label"]) => {
    if (label.includes("Buy")) return TrendingUp;
    if (label.includes("Sell")) return TrendingDown;
    return Minus;
  };

  const getSignalColor = (label: Signal["label"]) => {
    if (label.includes("Buy")) return "text-success";
    if (label.includes("Sell")) return "text-danger";
    return "text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Signals</h1>
            <p className="text-muted-foreground">
              Real-time trading signals powered by AI analysis
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Horizon:</span>
            <Select
              value={selectedHorizon}
              onValueChange={(value) =>
                setSelectedHorizon(value as TimeHorizon)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>

          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No signals available for the selected time horizon
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} showDetails />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Move</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Horizon</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSignals.map((signal) => {
                    const SignalIcon = getSignalIcon(signal.label);
                    const isExpanded = expandedRow === signal.id;

                    return (
                      <>
                        <TableRow
                          key={signal.id}
                          className="cursor-pointer"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : signal.id)
                          }
                        >
                          <TableCell className="font-medium">
                            {signal.asset}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <SignalIcon
                                className={cn(
                                  "h-4 w-4",
                                  getSignalColor(signal.label)
                                )}
                              />
                              <span className={getSignalColor(signal.label)}>
                                {signal.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(signal.probUp * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-medium",
                                signal.expectedMovePct > 0
                                  ? "text-success"
                                  : "text-danger"
                              )}
                            >
                              {signal.expectedMovePct > 0 ? "+" : ""}
                              {signal.expectedMovePct.toFixed(2)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            {(signal.confidence * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{signal.horizon}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(signal.timestamp).toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/50">
                              <div className="space-y-3 p-4">
                                <div>
                                  <p className="mb-2 text-sm font-semibold">
                                    Top Reasons:
                                  </p>
                                  <ul className="space-y-1 text-sm">
                                    {signal.reasons.map((reason, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-primary">•</span>
                                        <div>
                                          <span>{reason.text}</span>
                                          {reason.sourceUrl && (
                                            <a
                                              href={reason.sourceUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="ml-2 text-primary underline"
                                            >
                                              [Source]
                                            </a>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {signal.riskFlags.length > 0 && (
                                  <div>
                                    <p className="mb-1 text-sm font-semibold text-destructive">
                                      Risk Flags:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {signal.riskFlags.join(", ")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
