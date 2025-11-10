"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendation, RecommendationAction } from "@/lib/types";
import { useRecommendationStore } from "@/lib/stores/useRecommendationStore";
import { 
  fetchLatestRecommendation, 
  approveRecommendation, 
  rejectRecommendation 
} from "@/lib/api/recommendationApi";
import { useEffect, useState } from "react";

export default function RecommendationsPage() {
  const { 
    recommendations, 
    isLoading, 
    addRecommendation, 
    updateRecommendationStatus,
    setLoading,
    setLastFetched
  } = useRecommendationStore();
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);

  const getActionColor = (action: RecommendationAction) => {
    switch (action) {
      case "REBALANCE":
        return "bg-blue-500";
      case "BUY":
        return "bg-green-500";
      case "SELL":
        return "bg-orange-500";
      case "EXIT_TO_STABLE":
        return "bg-red-500";
      case "HOLD":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "executed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "executed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSignalIcon = (signal: "bullish" | "bearish" | "neutral") => {
    switch (signal) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-danger" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 3) return "text-success";
    if (score < 6) return "text-warning";
    return "text-danger";
  };

  // Fetch latest recommendation on component mount
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveRecommendation(id);
      updateRecommendationStatus(id, "approved");
    } catch (error) {
      console.error("Failed to approve recommendation:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRecommendation(id);
      updateRecommendationStatus(id, "rejected");
    } catch (error) {
      console.error("Failed to reject recommendation:", error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newRecommendation = await fetchLatestRecommendation();
      addRecommendation(newRecommendation);
      setLastFetched(new Date().toISOString());
    } catch (error) {
      console.error("Failed to fetch recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestRecommendation = recommendations[0]; // Newest first
  const displayedRecommendation = selectedRecommendation || latestRecommendation; // Show selected or latest

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Recommendations</h1>
            <p className="text-muted-foreground">
              AI-powered portfolio recommendations based on market analysis
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        {/* Alert */}
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertTitle>AI Agent Analysis</AlertTitle>
          <AlertDescription>
            The AI analyzes market regime, evaluates each asset, and calculates
            optimal portfolio allocation. All recommendations go through rules
            engine validation before execution.
          </AlertDescription>
        </Alert>

        {isLoading && recommendations.length === 0 ? (
          <Skeleton className="h-[600px]" />
        ) : !displayedRecommendation ? (
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertTitle>No Recommendations Yet</AlertTitle>
            <AlertDescription>
              Click &ldquo;Refresh&rdquo; to fetch the latest AI recommendation.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Main Recommendation Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedRecommendation ? "Selected" : "Latest"} Recommendation
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Generated at{" "}
                        {new Date(displayedRecommendation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRecommendation && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRecommendation(null)}
                      >
                        Back to Latest
                      </Button>
                    )}
                    <Badge
                      className={cn(
                        "text-white",
                        getStatusColor(displayedRecommendation.status)
                      )}
                    >
                      {getStatusIcon(displayedRecommendation.status)}
                      <span className="ml-1 capitalize">
                        {displayedRecommendation.status}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Action & Key Metrics */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Recommended Action
                        </p>
                        <Badge
                          className={cn(
                            "text-lg font-bold text-white",
                            getActionColor(displayedRecommendation.action)
                          )}
                        >
                          {displayedRecommendation.action}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Confidence Score
                        </p>
                        <p className="text-2xl font-bold">
                          {(displayedRecommendation.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Risk Score
                        </p>
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            getRiskColor(displayedRecommendation.riskScore)
                          )}
                        >
                          {displayedRecommendation.riskScore.toFixed(1)}/10
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Market Regime
                        </p>
                        <Badge
                          variant="outline"
                          className="text-lg font-semibold capitalize"
                        >
                          {displayedRecommendation.marketRegime}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Proposed Changes */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    Proposed Portfolio Changes
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Current Allocation</TableHead>
                        <TableHead>Proposed Allocation</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Signal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRecommendation.changes.map((change, idx) => {
                        const signal = displayedRecommendation.assetSignals.find(
                          (s) => s.asset === change.asset
                        );
                        const diff = change.to - change.from;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {change.asset}
                            </TableCell>
                            <TableCell>{change.from}%</TableCell>
                            <TableCell className="font-semibold">
                              {change.to}%
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "font-semibold",
                                  diff > 0 ? "text-success" : "text-danger"
                                )}
                              >
                                {diff > 0 ? "+" : ""}
                                {diff}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {signal && getSignalIcon(signal.signal)}
                                <span className="capitalize">
                                  {signal?.signal}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                {/* Reasoning */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    AI Reasoning & Analysis
                  </h3>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <ul className="space-y-2">
                      {displayedRecommendation.reasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 text-primary">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                {displayedRecommendation.status === "pending" && (
                  <>
                    <Separator />
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleReject(displayedRecommendation.id)}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="lg" onClick={() => handleApprove(displayedRecommendation.id)}>
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve & Proceed to Validation
                      </Button>
                    </div>
                  </>
                )}

                {displayedRecommendation.status === "approved" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Approved</AlertTitle>
                    <AlertDescription>
                      This recommendation has been approved and is now going
                      through rules engine validation.
                    </AlertDescription>
                  </Alert>
                )}

                {displayedRecommendation.status === "rejected" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Rejected</AlertTitle>
                    <AlertDescription>
                      This recommendation has been rejected and will not be
                      executed.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Recommendation History */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Recommendation History
                    </CardTitle>
                    <Badge variant="outline">
                      {recommendations.length} Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, idx) => (
                      <Card 
                        key={rec.id} 
                        className={cn(
                          "border-l-4 cursor-pointer transition-colors hover:bg-muted/50",
                          selectedRecommendation?.id === rec.id 
                            ? "border-l-primary bg-muted/30" 
                            : idx === 0 && !selectedRecommendation
                            ? "border-l-primary"
                            : "border-l-muted"
                        )}
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "text-white",
                                    getActionColor(rec.action)
                                  )}
                                >
                                  {rec.action}
                                </Badge>
                                <Badge
                                  className={cn(
                                    "text-white",
                                    getStatusColor(rec.status)
                                  )}
                                >
                                  {getStatusIcon(rec.status)}
                                  <span className="ml-1 capitalize">{rec.status}</span>
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(rec.timestamp).toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="grid gap-2 text-sm md:grid-cols-3">
                                <div>
                                  <span className="text-muted-foreground">Confidence:</span>{" "}
                                  <span className="font-semibold">
                                    {(rec.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Risk:</span>{" "}
                                  <span
                                    className={cn(
                                      "font-semibold",
                                      getRiskColor(rec.riskScore)
                                    )}
                                  >
                                    {rec.riskScore.toFixed(1)}/10
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Market:</span>{" "}
                                  <span className="font-semibold capitalize">
                                    {rec.marketRegime}
                                  </span>
                                </div>
                              </div>

                              <div className="text-sm">
                                <span className="text-muted-foreground">Changes:</span>{" "}
                                {rec.changes.map((c, idx) => (
                                  <span key={idx}>
                                    {c.asset} ({c.from}% → {c.to}%)
                                    {idx < rec.changes.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {rec.status === "pending" && (
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(rec.id)}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(rec.id)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>Confidence Score:</strong> Indicates how confident the
                  AI is about this recommendation based on signal strength and
                  data quality.
                </p>
                <p>
                  <strong>Risk Score:</strong> Estimated risk level of executing
                  this recommendation (0=very low, 10=very high).
                </p>
                <p>
                  <strong>Market Regime:</strong> Current market condition
                  detected by the AI (bull/bear/chop).
                </p>
                <p className="text-muted-foreground">
                  All approved recommendations must pass rules engine validation
                  before execution. This includes KYC/AML checks, risk limit
                  verification, and pre-trade validation.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
