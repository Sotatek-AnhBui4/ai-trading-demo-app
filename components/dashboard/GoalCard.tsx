import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/lib/types";
import { Target, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const getTrackingBadge = (status: Goal["trackingStatus"]) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-success">On Track</Badge>;
      case "behind":
        return <Badge variant="destructive">Behind</Badge>;
      case "ahead":
        return <Badge className="bg-blue-500">Ahead</Badge>;
    }
  };

  const progressPercentage =
    ((goal.currentReturnPct / goal.targetReturnPct) * 100);
  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(goal.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const daysRemaining = goal.horizonDays - daysElapsed;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {goal.targetReturnPct > 0 ? "+" : ""}
              {goal.targetReturnPct}% in {goal.horizonDays} days
            </CardTitle>
          </div>
          {getTrackingBadge(goal.trackingStatus)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Return</span>
            <span
              className={cn(
                "font-semibold",
                goal.currentReturnPct > 0 ? "text-success" : "text-danger"
              )}
            >
              {goal.currentReturnPct > 0 ? "+" : ""}
              {goal.currentReturnPct.toFixed(2)}%
            </span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage.toFixed(1)}% of target achieved
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Days Remaining</span>
            </div>
            <p className="font-semibold">{daysRemaining}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Probability to Hit</span>
            </div>
            <p className="font-semibold">{(goal.probToHit * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Capital Info */}
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Initial Capital</span>
            <span className="font-semibold">${goal.capitalUsd.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-muted-foreground">Risk Profile</span>
            <span className="font-medium capitalize">{goal.riskProfile}</span>
          </div>
        </div>

        {/* Allocation Preview */}
        {goal.plan.allocations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Asset Allocation</p>
            <div className="space-y-1">
              {goal.plan.allocations.slice(0, 3).map((allocation, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{allocation.asset}</span>
                  <span className="font-medium">{allocation.weight.toFixed(1)}%</span>
                </div>
              ))}
              {goal.plan.allocations.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{goal.plan.allocations.length - 3} more assets
                </p>
              )}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {goal.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(goal.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Warning if behind */}
        {goal.trackingStatus === "behind" && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
            <p className="text-muted-foreground">
              Goal is behind target. Consider adjusting strategy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

