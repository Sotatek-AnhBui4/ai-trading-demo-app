"use client";

import { RiskIndicator } from "@/components/dashboard/RiskIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRiskStore } from "@/lib/stores/useRiskStore";
import { RiskConfig } from "@/lib/types";
import { Shield, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function RiskSettings() {
  const { configs, activeConfig, isLoading } = useRiskStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RiskConfig | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<RiskConfig>>({
    name: "",
    perAssetCap: 20,
    sectorCap: 40,
    maxDailyVaR: 2,
    maxDrawdown: 3,
    maxSlippage: 0.25,
    stablecoinBuffer: 15,
    whitelist: [],
    blacklist: [],
    spotOnly: true,
    leverageEnabled: false,
    futuresEnabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving risk config:", formData);
    setIsCreateDialogOpen(false);
    setEditingConfig(null);
  };

  const handleEdit = (config: RiskConfig) => {
    setFormData(config);
    setEditingConfig(config);
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      perAssetCap: 20,
      sectorCap: 40,
      maxDailyVaR: 2,
      maxDrawdown: 3,
      maxSlippage: 0.25,
      stablecoinBuffer: 15,
      whitelist: [],
      blacklist: [],
      spotOnly: true,
      leverageEnabled: false,
      futuresEnabled: false,
    });
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Settings</h2>
          <p className="text-muted-foreground">
            Configure your trading risk controls and guardrails
          </p>
        </div>

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? "Edit" : "Create"} Risk Configuration
              </DialogTitle>
              <DialogDescription>
                Set your risk limits and trading restrictions
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Configuration Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Conservative, Aggressive"
                  required
                />
              </div>

              <Separator />

              {/* Position Limits */}
              <div className="space-y-4">
                <h3 className="font-semibold">Position Limits</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Per-Asset Cap: {formData.perAssetCap}%</Label>
                  </div>
                  <Slider
                    value={[formData.perAssetCap || 20]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, perAssetCap: value })
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
                    <Label>Sector Cap: {formData.sectorCap}%</Label>
                  </div>
                  <Slider
                    value={[formData.sectorCap || 40]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, sectorCap: value })
                    }
                    max={100}
                    min={10}
                    step={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum percentage of capital in a single sector (default: 40%)
                  </p>
                </div>
              </div>

              <Separator />

              {/* Risk Limits */}
              <div className="space-y-4">
                <h3 className="font-semibold">Risk Limits</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max Daily VaR: {formData.maxDailyVaR}%</Label>
                  </div>
                  <Slider
                    value={[formData.maxDailyVaR || 2]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, maxDailyVaR: value })
                    }
                    max={5}
                    min={0.5}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum Value at Risk per day (default: 2%)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max Drawdown: {formData.maxDrawdown}%</Label>
                  </div>
                  <Slider
                    value={[formData.maxDrawdown || 3]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, maxDrawdown: value })
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
                    <Label>Max Slippage: {formData.maxSlippage}%</Label>
                  </div>
                  <Slider
                    value={[formData.maxSlippage || 0.25]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, maxSlippage: value })
                    }
                    max={1}
                    min={0.1}
                    step={0.05}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum slippage per order (default: 0.25%)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Stablecoin Buffer: {formData.stablecoinBuffer}%</Label>
                  </div>
                  <Slider
                    value={[formData.stablecoinBuffer || 15]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, stablecoinBuffer: value })
                    }
                    max={50}
                    min={5}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum stablecoin buffer to maintain (default: 15%)
                  </p>
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Leverage</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow leveraged positions
                    </p>
                  </div>
                  <Switch
                    checked={formData.leverageEnabled}
                    disabled={formData.spotOnly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, leverageEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Futures/Perpetuals</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow futures and perpetual contracts
                    </p>
                  </div>
                  <Switch
                    checked={formData.futuresEnabled}
                    disabled={formData.spotOnly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, futuresEnabled: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Shield className="mr-2 h-4 w-4" />
                  {editingConfig ? "Update" : "Create"} Configuration
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Risk Management</AlertTitle>
        <AlertDescription>
          These settings control automated risk management. Circuit breakers will
          automatically move your portfolio to stablecoins if limits are breached.
        </AlertDescription>
      </Alert>

      {/* Active Configuration */}
      {activeConfig && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">Active Configuration</h3>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>{activeConfig.name}</CardTitle>
                </div>
                <Badge>Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <RiskIndicator
                  value={activeConfig.perAssetCap}
                  max={50}
                  label="Per-Asset Cap"
                />
                <RiskIndicator
                  value={activeConfig.maxDailyVaR}
                  max={5}
                  label="Daily VaR"
                />
                <RiskIndicator
                  value={activeConfig.maxDrawdown}
                  max={10}
                  label="Max Drawdown"
                />
                <RiskIndicator
                  value={activeConfig.maxSlippage}
                  max={1}
                  label="Max Slippage"
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sector Cap</p>
                  <p className="text-lg font-semibold">
                    {activeConfig.sectorCap}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Stablecoin Buffer
                  </p>
                  <p className="text-lg font-semibold">
                    {activeConfig.stablecoinBuffer}%
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium">Trading Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  {activeConfig.spotOnly && (
                    <Badge variant="outline">Spot Only</Badge>
                  )}
                  {activeConfig.leverageEnabled && (
                    <Badge variant="outline">Leverage Enabled</Badge>
                  )}
                  {activeConfig.futuresEnabled && (
                    <Badge variant="outline">Futures Enabled</Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(activeConfig)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Configurations */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">All Configurations</h3>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : configs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {configs.map((config) => (
              <Card key={config.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    {activeConfig?.id === config.id && (
                      <Badge>Active</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Per-Asset Cap</p>
                      <p className="font-semibold">{config.perAssetCap}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Drawdown</p>
                      <p className="font-semibold">{config.maxDrawdown}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily VaR</p>
                      <p className="font-semibold">{config.maxDailyVaR}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Slippage</p>
                      <p className="font-semibold">{config.maxSlippage}%</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {activeConfig?.id !== config.id && (
                      <Button size="sm" variant="outline">
                        Set Active
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No risk configurations yet. Create one to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

