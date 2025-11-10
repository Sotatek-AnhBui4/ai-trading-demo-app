"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { AllocationChart } from "@/components/charts/AllocationChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoalStore } from "@/lib/stores/useGoalStore";
import { RiskLevel } from "@/lib/types";
import { Plus, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function GoalsPage() {
  const { goals, isLoading } = useGoalStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    capitalUsd: 10000,
    targetReturnPct: 5,
    horizonDays: 60,
    riskProfile: "moderate" as RiskLevel,
    spotOnly: true,
    maxAssetWeightPct: 20,
    maxDrawdownPct: 3,
    maxDailyVarPct: 2,
    blacklist: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to the API in the integration step
    console.log("Creating goal:", formData);
    setIsCreateDialogOpen(false);
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goals</h1>
            <p className="text-muted-foreground">
              Create and manage your trading goals
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Trading Goal</DialogTitle>
                <DialogDescription>
                  Set your target return and risk parameters for AI-powered trading
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="capital">Initial Capital (USD)</Label>
                      <Input
                        id="capital"
                        type="number"
                        value={formData.capitalUsd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capitalUsd: Number(e.target.value),
                          })
                        }
                        min={100}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target">Target Return (%)</Label>
                      <Input
                        id="target"
                        type="number"
                        value={formData.targetReturnPct}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetReturnPct: Number(e.target.value),
                          })
                        }
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="horizon">Time Horizon (Days)</Label>
                      <Input
                        id="horizon"
                        type="number"
                        value={formData.horizonDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            horizonDays: Number(e.target.value),
                          })
                        }
                        min={1}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riskProfile">Risk Profile</Label>
                      <Select
                        value={formData.riskProfile}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            riskProfile: value as RiskLevel,
                          })
                        }
                      >
                        <SelectTrigger id="riskProfile">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Risk Constraints */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Risk Constraints</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Asset Weight: {formData.maxAssetWeightPct}%</Label>
                      </div>
                      <Slider
                        value={[formData.maxAssetWeightPct]}
                        onValueChange={([value]) =>
                          setFormData({ ...formData, maxAssetWeightPct: value })
                        }
                        max={50}
                        min={5}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum percentage of capital in a single asset (default: 20%)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Drawdown: {formData.maxDrawdownPct}%</Label>
                      </div>
                      <Slider
                        value={[formData.maxDrawdownPct]}
                        onValueChange={([value]) =>
                          setFormData({ ...formData, maxDrawdownPct: value })
                        }
                        max={10}
                        min={1}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum portfolio drawdown allowed (default: 3%)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Daily VaR: {formData.maxDailyVarPct}%</Label>
                      </div>
                      <Slider
                        value={[formData.maxDailyVarPct]}
                        onValueChange={([value]) =>
                          setFormData({ ...formData, maxDailyVarPct: value })
                        }
                        max={5}
                        min={0.5}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum Value at Risk per day (default: 2%)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trading Restrictions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Trading Restrictions</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Spot Trading Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Disable leverage and futures trading
                      </p>
                    </div>
                    <Switch
                      checked={formData.spotOnly}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, spotOnly: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Target className="mr-2 h-4 w-4" />
                    Create Goal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeGoals.filter((g) => g.trackingStatus === "on-track").length} on track
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                All time achievements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {goals.length > 0
                  ? ((activeGoals.filter((g) => g.trackingStatus === "on-track").length /
                      goals.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Goals meeting targets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Active Goals</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : activeGoals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No active goals. Create one to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Completed Goals</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

