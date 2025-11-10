"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { AllocationChart } from "@/components/charts/AllocationChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExchangeStore } from "@/lib/stores/useExchangeStore";
import { useSignalStore } from "@/lib/stores/useSignalStore";
import { useGoalStore } from "@/lib/stores/useGoalStore";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSignalData } from "@/hooks/useSignalData";
import { DollarSign, TrendingUp, AlertCircle, Target } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  // Load all dashboard data
  useDashboardData();
  useSignalData();

  const { portfolioStats, isLoading: statsLoading } = useExchangeStore();
  const { signals, isLoading: signalsLoading } = useSignalStore();
  const { goals, isLoading: goalsLoading } = useGoalStore();
  const { balanceHistory, isLoading: historyLoading } = useHistoryStore();

  const activeGoals = goals.filter((g) => g.status === "active");
  const recentSignals = signals.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AI trading portfolio
          </p>
        </div>

        {/* Disclaimer Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            Trading involves risk. Results are probabilistic and not guaranteed.
            This is not financial advice.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : portfolioStats ? (
            <>
              <StatCard
                title="Total Balance"
                value={`$${portfolioStats.totalBalance.toLocaleString()}`}
                icon={DollarSign}
                description="Current portfolio value"
              />
              <StatCard
                title="Total P&L"
                value={`$${portfolioStats.totalPnL.toLocaleString()}`}
                icon={TrendingUp}
                trend={{
                  value: portfolioStats.totalPnLPct,
                  isPositive: portfolioStats.totalPnLPct > 0,
                }}
              />
              <StatCard
                title="Daily VaR"
                value={`${portfolioStats.dailyVaR.toFixed(2)}%`}
                icon={AlertCircle}
                description="Max 2% allowed"
              />
              <StatCard
                title="Active Goals"
                value={activeGoals.length}
                icon={Target}
                description={`${
                  activeGoals.filter((g) => g.trackingStatus === "on-track")
                    .length
                } on track`}
              />
            </>
          ) : null}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Balance History */}
          <Card>
            <CardHeader>
              <CardTitle>Balance History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
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

          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-[300px]" />
              ) : portfolioStats && portfolioStats.allocation.length > 0 ? (
                <AllocationChart allocations={portfolioStats.allocation} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  No allocation data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Signals */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Recent AI Signals</h2>
          {signalsLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : recentSignals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} showDetails />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No signals available at the moment
              </CardContent>
            </Card>
          )}
        </div>

        {/* Active Goals */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Active Goals</h2>
          {goalsLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : activeGoals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeGoals.slice(0, 2).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No active goals. Create one to get started!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
