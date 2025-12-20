import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Resolve path relative to the compiled server location
  // When bundled, __dirname will be 'dist', so we need 'dist/public'
  const distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files with proper Content-Type headers
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      // Set Content-Type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
      };
      
      if (contentTypes[ext]) {
        res.setHeader('Content-Type', contentTypes[ext]);
      }
    }
  }));

  // Fall through to index.html for all non-API routes (SPA routing)
  // This must be after static middleware and API routes
  app.get("*", (req: Request, res: Response) => {
    // Skip API routes - they should be handled by registerRoutes
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API route not found" });
      return;
    }
    
    const indexPath = path.resolve(distPath, "index.html");
    
    // Ensure the file exists before sending
    if (!fs.existsSync(indexPath)) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });
}
