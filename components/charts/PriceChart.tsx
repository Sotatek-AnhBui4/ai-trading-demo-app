"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface PriceDataPoint {
  timestamp: string;
  price: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  color?: string;
}

export function PriceChart({ data, color = "hsl(var(--chart-1))" }: PriceChartProps) {
  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).getTime(),
    price: item.price,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")}
          className="text-xs"
        />
        <YAxis
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          className="text-xs"
        />
        <Tooltip
          labelFormatter={(timestamp) =>
            format(new Date(timestamp), "MMM dd, HH:mm")
          }
          formatter={(value: number) => [
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Price",
          ]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

