import express, { type Request, Response, NextFunction, type Express } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type Server } from "http";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Export a function to create and configure the Express app
// This allows it to be used both for regular server and Vercel serverless functions
export async function createApp(httpServer?: Server, app?: Express): Promise<Express> {
  const expressApp = app || express();

  expressApp.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  expressApp.use(express.urlencoded({ extended: false }));

  expressApp.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  // Use provided httpServer or create a new one (for Vercel serverless, we don't need it)
  const server = httpServer || createServer(expressApp);
  await registerRoutes(server, expressApp);

  expressApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(expressApp);
  } else if (server) {
    // Only setup Vite if we have a server (not in Vercel serverless mode)
    const { setupVite } = await import("./vite");
    await setupVite(server, expressApp);
  }

  return expressApp;
}

// Only start the server if not running on Vercel (Vercel uses serverless functions)
if (!process.env.VERCEL) {
  (async () => {
    // Create app first
    const app = express();
    
    // Create httpServer with the app
    const httpServer = createServer(app);
    
    // Now configure the app with routes and Vite, passing both the httpServer and the app
    await createApp(httpServer, app);

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);

    // Bind to 0.0.0.0 to accept connections from all interfaces (required for deployment)
    const host = process.env.HOST || "0.0.0.0";
    
    httpServer.listen(
    {
      port,
      host,
    },
    () => {
      log(`serving on http://localhost:${port}`);
      log(`Open your browser at http://localhost:${port}`);
    },
  );
  })();
}
