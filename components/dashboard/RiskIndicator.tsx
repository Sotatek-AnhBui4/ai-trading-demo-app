import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface RiskIndicatorProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  className?: string;
}

export function RiskIndicator({
  value,
  max,
  label,
  unit = "%",
  className,
}: RiskIndicatorProps) {
  const percentage = (value / max) * 100;
  
  const getStatus = () => {
    if (percentage >= 90) return { color: "text-danger", icon: AlertCircle };
    if (percentage >= 70) return { color: "text-yellow-500", icon: AlertTriangle };
    return { color: "text-success", icon: CheckCircle };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-1">
          <Icon className={cn("h-4 w-4", status.color)} />
          <span className={cn("text-sm font-semibold", status.color)}>
            {value.toFixed(2)}{unit} / {max}{unit}
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-all",
            percentage >= 90 && "bg-danger",
            percentage >= 70 && percentage < 90 && "bg-yellow-500",
            percentage < 70 && "bg-success"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

