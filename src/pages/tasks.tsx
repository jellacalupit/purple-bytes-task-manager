import { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { FilterBar } from "@/components/filter-bar";
import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { SearchInput } from "@/components/search-input";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localStorageService } from "@/lib/localStorage";
import {
  type Task,
  type TaskStatus,
  type TaskCategory,
  type InsertTask,
  type TaskPriority,
} from "@shared/schema";

const priorityOrder: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const statusOrder: Record<TaskStatus, number> = {
  "in-progress": 0,
  "todo": 1,
  "done": 2,
};

export default function Tasks() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("created");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = localStorageService.getTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortOption) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          return priorityOrder[(a.priority || "medium") as TaskPriority] - 
                 priorityOrder[(b.priority || "medium") as TaskPriority];
        case "status":
          return statusOrder[a.status as TaskStatus] - statusOrder[b.status as TaskStatus];
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
        default:
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, statusFilter, categoryFilter, searchQuery, sortOption]);

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return localStorageService.createTask(data);
    },
    onSuccess: (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      setIsFormOpen(false);
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTask> }) => {
      const updated = localStorageService.updateTask(id, data);
      if (!updated) {
        throw new Error("Task not found");
      }
      return updated;
    },
    onSuccess: (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setEditTask(null);
      setIsFormOpen(false);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Update task error:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const deleted = localStorageService.deleteTask(id);
      if (!deleted) {
        throw new Error("Task not found");
      }
    },
    onSuccess: (_, deletedId) => {
      setTasks((prev) => prev.filter((t) => t.id !== deletedId));
      setDeleteTask(null);
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTaskMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (task: Task) => {
    setDeleteTask(task);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: InsertTask) => {
    if (editTask) {
      updateTaskMutation.mutate({ id: editTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const handleFormClose = (open: boolean) => {
    if (!open) {
      setEditTask(null);
    }
    setIsFormOpen(open);
  };

  const handleConfirmDelete = () => {
    if (deleteTask) {
      deleteTaskMutation.mutate(deleteTask.id);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  const hasFilters = statusFilter !== "all" || categoryFilter !== "all" || searchQuery !== "";

  const taskCounts = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { todo, inProgress, done, total: tasks.length };
  }, [tasks]);

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2" data-testid="text-page-title">
              Your Tasks
            </h2>
            <p className="text-muted-foreground" data-testid="text-task-summary">
              {taskCounts.total === 0
                ? "No tasks yet. Create one to get started!"
                : `To-do: ${taskCounts.todo} / In Progress: ${taskCounts.inProgress} / Done: ${taskCounts.done}`}
            </p>
          </div>
          <div>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              data-testid="button-new-task"
              className="bg-[#E7C3F6] text-black hover:bg-[#D38EEC] border border-[#D38EEC] dark:bg-[#9D43AD] dark:hover:bg-[#833E8F] dark:text-white dark:border-[#9D43AD]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <SortDropdown
            value={sortOption}
            onChange={setSortOption}
          />
        </div>

        <FilterBar
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          onStatusChange={setStatusFilter}
          onCategoryChange={setCategoryFilter}
          onClearFilters={handleClearFilters}
        />

        <div className="py-6">
          <TaskList
            tasks={filteredAndSortedTasks}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
            hasFilters={hasFilters}
          />
        </div>
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        editTask={editTask}
      />

      <DeleteConfirmDialog
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        task={deleteTask}
        onConfirm={handleConfirmDelete}
        isLoading={deleteTaskMutation.isPending}
      />
    </LayoutWrapper>
  );
}
