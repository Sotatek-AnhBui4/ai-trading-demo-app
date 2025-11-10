"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BalanceHistory } from "@/lib/types";
import { format } from "date-fns";

interface BalanceChartProps {
  data: BalanceHistory[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).getTime(),
    value: item.totalValueUsd,
    pnl: item.pnlUsd,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => format(new Date(timestamp), "MM/dd")}
          className="text-xs"
        />
        <YAxis
          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          className="text-xs"
        />
        <Tooltip
          labelFormatter={(timestamp) =>
            format(new Date(timestamp), "MMM dd, yyyy")
          }
          formatter={(value: number) => [
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Balance",
          ]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

