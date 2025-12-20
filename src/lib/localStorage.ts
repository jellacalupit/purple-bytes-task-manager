import type { Task, InsertTask } from "@shared/schema";

const STORAGE_KEY = "task-manager-tasks";

export const localStorageService = {
  getTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const tasks = JSON.parse(stored);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      }));
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  saveTasks(tasks: any[]): void {
    try {
      // Convert Date objects to ISO strings for storage
      const tasksToSave = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
        dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      throw new Error("Failed to save tasks. Storage may be full.");
    }
  },

  createTask(task: InsertTask): Task {
    const tasks = this.getTasks();
    const now = new Date();
    const dueDate = task.dueDate 
      ? (task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate))
      : null;
    
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      dueDate: dueDate,
      description: task.description ?? null,
    };
    
    // Save with dates as ISO strings for JSON serialization
    const allTasksToSave = [
      ...tasks.map(t => ({
        ...t,
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
        dueDate: t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate,
      })),
      {
        ...newTask,
        createdAt: now.toISOString(),
        dueDate: dueDate ? dueDate.toISOString() : null,
      }
    ];
    
    this.saveTasks(allTasksToSave as any);
    
    return newTask;
  },

  updateTask(id: string, updates: Partial<InsertTask>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = tasks[index];
    
    // Handle dueDate conversion
    let dueDate: Date | null = null;
    if (updates.dueDate !== undefined) {
      dueDate = updates.dueDate 
        ? (updates.dueDate instanceof Date ? updates.dueDate : new Date(updates.dueDate))
        : null;
    } else {
      dueDate = existing.dueDate;
    }
    
    const updated: Task = {
      ...existing,
      ...updates,
      id: existing.id, // Ensure ID doesn't change
      createdAt: existing.createdAt, // Ensure createdAt doesn't change
      dueDate: dueDate,
    };
    
    // Save with dates as ISO strings
    const tasksToSave = tasks.map((t, i) => {
      if (i === index) {
        return {
          ...updated,
          createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
          dueDate: updated.dueDate instanceof Date ? updated.dueDate.toISOString() : updated.dueDate,
        };
      }
      return {
        ...t,
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
        dueDate: t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate,
      };
    });
    
    this.saveTasks(tasksToSave as any);
    
    return updated;
  },

  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    this.saveTasks(filtered);
    return true;
  },
};

