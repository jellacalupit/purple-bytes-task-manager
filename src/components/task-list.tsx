import { TaskCard } from "./task-card";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { type Task, type TaskStatus } from "@shared/schema";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  hasFilters?: boolean;
}

function TaskListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskList({
  tasks,
  isLoading,
  onStatusChange,
  onDelete,
  onEdit,
  hasFilters,
}: TaskListProps) {
  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "No matching tasks" : "No tasks yet"}
        description={
          hasFilters
            ? "Try adjusting your filters or create new task."
            : "Get started by creating your first task."
        }
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      data-testid="task-list"
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
