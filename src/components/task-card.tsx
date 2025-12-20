import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { CategoryTag } from "./category-tag";
import { PriorityBadge } from "./priority-badge";
import { type Task, type TaskStatus, type TaskPriority, TASK_STATUSES } from "@shared/schema";
import { MoreVertical, Trash2, CheckCircle, Circle, Clock, Pencil, CalendarDays } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const statusIcons: Record<TaskStatus, typeof Circle> = {
  "todo": Circle,
  "in-progress": Clock,
  "done": CheckCircle,
};

export function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== "done";
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <Card
      className="group transition-all duration-200 hover-elevate cursor-pointer border-[#D38EEC] dark:border-[#9D43AD]"
      data-testid={`card-task-${task.id}`}
      onClick={() => onEdit(task)}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-lg font-medium leading-tight truncate",
              task.status === "done" && "line-through text-muted-foreground"
            )}
            data-testid={`text-task-title-${task.id}`}
          >
            {task.title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              data-testid={`button-task-menu-${task.id}`}
              aria-label="Task options"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              data-testid={`button-edit-task-${task.id}`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {TASK_STATUSES.map((statusOption) => {
              const Icon = statusIcons[statusOption.value];
              return (
                <DropdownMenuItem
                  key={statusOption.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, statusOption.value);
                  }}
                  data-testid={`menu-item-status-${statusOption.value}-${task.id}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  Mark as {statusOption.label}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="text-destructive focus:text-destructive"
              data-testid={`button-delete-task-${task.id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p
            className="text-sm text-muted-foreground line-clamp-2"
            data-testid={`text-task-description-${task.id}`}
          >
            {task.description}
          </p>
        )}
        {dueDate && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isOverdue && "text-red-600 dark:text-red-400",
              isDueToday && !isOverdue && "text-amber-600 dark:text-amber-400",
              !isOverdue && !isDueToday && "text-muted-foreground"
            )}
            data-testid={`text-due-date-${task.id}`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>
              {isOverdue ? "Overdue: " : isDueToday ? "Due today: " : "Due: "}
              {format(dueDate, "MMM d, yyyy")}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status as TaskStatus} />
          <CategoryTag category={task.category as any} />
          <PriorityBadge priority={(task.priority || "medium") as TaskPriority} />
        </div>
      </CardContent>
    </Card>
  );
}
