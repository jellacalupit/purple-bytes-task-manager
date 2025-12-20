import { Badge } from "@/components/ui/badge";
import { type TaskStatus } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; bgColor: string; textColor: string }> = {
  "todo": {
    label: "To-Do",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
  },
  "in-progress": {
    label: "In Progress",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  "done": {
    label: "Done",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm",
        config.bgColor,
        config.textColor,
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </div>
  );
}
