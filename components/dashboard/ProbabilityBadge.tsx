import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProbabilityBadgeProps {
  probability: number; // 0-1
  className?: string;
}

export function ProbabilityBadge({
  probability,
  className,
}: ProbabilityBadgeProps) {
  const percentage = (probability * 100).toFixed(1);
  
  const getColor = () => {
    if (probability >= 0.7) return "bg-success text-success-foreground";
    if (probability >= 0.5) return "bg-yellow-500 text-white";
    return "bg-danger text-danger-foreground";
  };

  return (
    <Badge className={cn(getColor(), className)}>
      {percentage}% probability
    </Badge>
  );
}

