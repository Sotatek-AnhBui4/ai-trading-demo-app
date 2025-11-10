import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Signal } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  signal: Signal;
  showDetails?: boolean;
}

export function SignalCard({ signal, showDetails = false }: SignalCardProps) {
  const getSignalColor = (label: Signal["label"]) => {
    switch (label) {
      case "Strong Buy":
        return "bg-success text-success-foreground";
      case "Buy":
        return "bg-success/70 text-success-foreground";
      case "Strong Sell":
        return "bg-danger text-danger-foreground";
      case "Sell":
        return "bg-danger/70 text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSignalIcon = (label: Signal["label"]) => {
    const iconProps = { className: "mr-1 h-3 w-3" };
    if (label.includes("Buy")) return <TrendingUp {...iconProps} />;
    if (label.includes("Sell")) return <TrendingDown {...iconProps} />;
    return <Minus {...iconProps} />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{signal.asset}</CardTitle>
          <Badge className={cn(getSignalColor(signal.label))}>
            {getSignalIcon(signal.label)}
            {signal.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Probability</p>
            <p className="font-semibold">{(signal.probUp * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expected Move</p>
            <p
              className={cn(
                "font-semibold",
                signal.expectedMovePct > 0 ? "text-success" : "text-danger"
              )}
            >
              {signal.expectedMovePct > 0 ? "+" : ""}
              {signal.expectedMovePct.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Confidence</p>
            <p className="font-semibold">
              {(signal.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {showDetails && signal.reasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Reasons:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {signal.reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{reason.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {signal.riskFlags.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Risk Flags:</p>
              <p className="text-muted-foreground">{signal.riskFlags.join(", ")}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{signal.horizon} horizon</span>
          <span>{new Date(signal.timestamp).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

