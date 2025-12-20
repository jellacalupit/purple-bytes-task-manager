import type { Express } from "express";
import { createServer, type Server } from "http";

// API routes removed - app now uses browser localStorage
// Server is only used for serving static files and Vite dev server
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No API routes needed - all data is stored in browser localStorage
  return httpServer;
}
