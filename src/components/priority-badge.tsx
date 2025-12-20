import { Badge } from "@/components/ui/badge";
import { type TaskPriority } from "@shared/schema";
import { cn } from "@/lib/utils";
import { AlertTriangle, Minus, ArrowDown } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; icon: typeof AlertTriangle; colorClass: string }> = {
  "high": {
    label: "High",
    icon: AlertTriangle,
    colorClass: "text-red-600 dark:text-red-400",
  },
  "medium": {
    label: "Medium",
    icon: Minus,
    colorClass: "text-amber-600 dark:text-amber-400",
  },
  "low": {
    label: "Low",
    icon: ArrowDown,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center gap-1", config.colorClass, className)}
      data-testid={`badge-priority-${priority}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
