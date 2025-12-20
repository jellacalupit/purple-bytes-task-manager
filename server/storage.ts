// Storage is no longer used - app now uses browser localStorage
// This file is kept for compatibility but database operations are disabled
import { type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
}

export class DBStorage implements IStorage {
  async getUser(_id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(_username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(_user: InsertUser): Promise<User> {
    throw new Error("Database storage is disabled - app uses localStorage");
  }

  async getAllTasks(): Promise<Task[]> {
    return [];
  }

  async getTask(_id: string): Promise<Task | undefined> {
    return undefined;
  }

  async createTask(_task: InsertTask): Promise<Task> {
    throw new Error("Database storage is disabled - app uses localStorage");
  }

  async updateTask(_id: string, _updates: Partial<InsertTask>): Promise<Task | undefined> {
    throw new Error("Database storage is disabled - app uses localStorage");
  }

  async deleteTask(_id: string): Promise<boolean> {
    throw new Error("Database storage is disabled - app uses localStorage");
  }
}

export const storage = new DBStorage();
