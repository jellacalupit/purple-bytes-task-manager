import { z } from "zod";

// User schema (for future use)
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & {
  id: string;
};

// Task enums
export const taskStatusEnum = z.enum(["todo", "in-progress", "done"]);
export type TaskStatus = z.infer<typeof taskStatusEnum>;

export const taskCategoryEnum = z.enum(["work", "personal", "shopping", "health", "finance", "other"]);
export type TaskCategory = z.infer<typeof taskCategoryEnum>;

export const taskPriorityEnum = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof taskPriorityEnum>;

// Task schema
export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional().nullable(),
  status: taskStatusEnum.default("todo"),
  category: taskCategoryEnum.default("other"),
  priority: taskPriorityEnum.default("medium"),
  dueDate: z.union([z.date(), z.string(), z.null()]).optional().nullable(),
});

export const updateTaskSchema = insertTaskSchema.partial().extend({
  id: z.string(),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

// Task type matching the schema
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
};

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const TASK_CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
