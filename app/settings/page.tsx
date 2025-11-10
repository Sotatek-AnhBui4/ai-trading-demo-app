"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskSettings } from "@/components/settings/RiskSettings";
import { ExecutionSettings } from "@/components/settings/ExecutionSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Zap } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure risk controls and execution settings
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="execution" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="execution" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Execution Settings
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="execution">
            <ExecutionSettings />
          </TabsContent>

          <TabsContent value="risk">
            <RiskSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
