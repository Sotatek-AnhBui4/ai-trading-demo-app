"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExecutionSettings as ExecutionSettingsType } from "@/lib/types";
import { Zap, Save, AlertTriangle, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock initial data - will be replaced with store/API
const initialSettings: ExecutionSettingsType = {
  mode: "manual",
  autoExecuteRebalancing: false,
  rebalancingFrequency: "weekly",
  autoStopLoss: true,
  stopLossType: "trailing",
  stopLossPercentage: 3,
  autoTakeProfit: false,
  takeProfitWhenGoalReached: true,
  requireApprovalThreshold: 1000,
  notificationsEnabled: true,
};

export function ExecutionSettings() {
  const [settings, setSettings] =
    useState<ExecutionSettingsType>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof ExecutionSettingsType>(
    key: K,
    value: ExecutionSettingsType[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Call API to save settings
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Execution Settings</h2>
          <p className="text-muted-foreground">
            Configure how AI recommendations are executed
          </p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Important Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>⚡ Execution Mode - QUAN TRỌNG NHẤT!</AlertTitle>
        <AlertDescription>
          Choose between Manual (requires your approval) or Auto (fully
          automated). This is the most critical setting for your trading system.
        </AlertDescription>
      </Alert>

      {/* Execution Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Execution Mode
            </CardTitle>
            <Badge
              className={cn(
                "text-white",
                settings.mode === "manual" ? "bg-orange-500" : "bg-green-500"
              )}
            >
              {settings.mode === "manual" ? "🔴 MODE 1: MANUAL" : "🟢 MODE 2: AUTO"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label htmlFor="mode" className="text-base font-semibold">
              Select Mode
            </Label>
            <Select
              value={settings.mode}
              onValueChange={(value: "manual" | "auto") =>
                updateSetting("mode", value)
              }
            >
              <SelectTrigger id="mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔴</span>
                    <div>
                      <p className="font-semibold">MODE 1: MANUAL</p>
                      <p className="text-xs text-muted-foreground">
                        User approval required
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟢</span>
                    <div>
                      <p className="font-semibold">MODE 2: AUTO</p>
                      <p className="text-xs text-muted-foreground">
                        Fully automated
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode Description */}
          {settings.mode === "manual" ? (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                Manual Mode (User Approve)
              </p>
              <ol className="list-inside list-decimal space-y-1 text-sm text-orange-800 dark:text-orange-200">
                <li>Agent sends notification to user</li>
                <li>
                  Example: <em>&ldquo;Tôi đề xuất mua BTC 18%. Bạn có đồng ý không? (Yes/No)&rdquo;</em>
                </li>
                <li>User clicks &ldquo;Yes&rdquo;</li>
                <li>System executes</li>
              </ol>
            </div>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <p className="mb-2 font-semibold text-green-900 dark:text-green-100">
                Auto Mode (Fully Automated)
              </p>
              <ol className="list-inside list-decimal space-y-1 text-sm text-green-800 dark:text-green-200">
                <li>Agent recommends + Rules approve</li>
                <li>
                  <strong>System TỰ ĐỘNG execute</strong> (không cần user)
                </li>
                <li>
                  Only notify user AFTER execution:{" "}
                  <em>&ldquo;✅ Đã mua BTC 18% theo chiến lược tự động&rdquo;</em>
                </li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Settings */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-execute Rebalancing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-execute Rebalancing</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically rebalance portfolio on schedule
                </p>
              </div>
              <Switch
                checked={settings.autoExecuteRebalancing}
                onCheckedChange={(checked) =>
                  updateSetting("autoExecuteRebalancing", checked)
                }
              />
            </div>

            {settings.autoExecuteRebalancing && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="frequency">Rebalancing Frequency</Label>
                <Select
                  value={settings.rebalancingFrequency}
                  onValueChange={(value: string) =>
                    updateSetting("rebalancingFrequency", value as ExecutionSettingsType["rebalancingFrequency"])
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (Hàng ngày)</SelectItem>
                    <SelectItem value="weekly">Weekly (Hàng tuần)</SelectItem>
                    <SelectItem value="biweekly">Biweekly (2 tuần/lần)</SelectItem>
                    <SelectItem value="monthly">Monthly (Hàng tháng)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Auto Stop-Loss */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto Stop-Loss</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically exit positions to limit losses
                </p>
              </div>
              <Switch
                checked={settings.autoStopLoss}
                onCheckedChange={(checked) =>
                  updateSetting("autoStopLoss", checked)
                }
              />
            </div>

            {settings.autoStopLoss && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLossType">Stop-Loss Type</Label>
                  <Select
                    value={settings.stopLossType}
                    onValueChange={(value: string) =>
                      updateSetting("stopLossType", value as ExecutionSettingsType["stopLossType"])
                    }
                  >
                    <SelectTrigger id="stopLossType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trailing">
                        Trailing (Theo dõi giá)
                      </SelectItem>
                      <SelectItem value="fixed">Fixed (Cố định)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Stop-Loss: {settings.stopLossPercentage}%
                  </Label>
                  <Slider
                    value={[settings.stopLossPercentage]}
                    onValueChange={([value]) =>
                      updateSetting("stopLossPercentage", value)
                    }
                    min={1}
                    max={10}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 3% for trailing stop-loss
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Auto Take-Profit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto Take-Profit</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically take profits when goal is reached
                </p>
              </div>
              <Switch
                checked={settings.takeProfitWhenGoalReached}
                onCheckedChange={(checked) =>
                  updateSetting("takeProfitWhenGoalReached", checked)
                }
              />
            </div>
          </div>

          <Separator />

          {/* Approval Threshold */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-base">
                Require Approval for Trades &gt; ${settings.requireApprovalThreshold.toLocaleString()}
              </Label>
              <p className="text-sm text-muted-foreground">
                Trades above this amount will always require manual approval
              </p>
              <Input
                id="threshold"
                type="number"
                value={settings.requireApprovalThreshold}
                onChange={(e) =>
                  updateSetting(
                    "requireApprovalThreshold",
                    Number(e.target.value)
                  )
                }
                min={100}
                step={100}
              />
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about trades, signals, and system events
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) =>
                updateSetting("notificationsEnabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Current Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <div className="flex justify-between">
            <span>Execution Mode:</span>
            <Badge className={cn(
              settings.mode === "manual" ? "bg-orange-500" : "bg-green-500"
            )}>
              {settings.mode.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Auto Rebalancing:</span>
            <span className="font-semibold">
              {settings.autoExecuteRebalancing
                ? `✓ Enabled (${settings.rebalancingFrequency})`
                : "✗ Disabled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auto Stop-Loss:</span>
            <span className="font-semibold">
              {settings.autoStopLoss
                ? `✓ ${settings.stopLossType} ${settings.stopLossPercentage}%`
                : "✗ Disabled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auto Take-Profit:</span>
            <span className="font-semibold">
              {settings.takeProfitWhenGoalReached ? "✓ Enabled" : "✗ Disabled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Approval Threshold:</span>
            <span className="font-semibold">
              ${settings.requireApprovalThreshold.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

