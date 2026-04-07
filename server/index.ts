import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import { connectDB } from "./config/db";
import { initAdmin } from "./controllers/adminController";
import { initTests } from "./controllers/testController";
import { setupCronJobs } from "./services/cronService";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// Route Imports
import adminRoutes from "./routes/adminRoutes";
import testRoutes from "./routes/testRoutes";
import bookingRoutes from "./routes/bookingRoutes";

import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

// Ensures uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(cors());
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
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

(async () => {
  // 1. Connect to MongoDB
  await connectDB();
  
  // 2. Initialize Admin
  await initAdmin();

  // 3. Initialize Tests
  await initTests();

  // 4. Setup Cron Jobs
  setupCronJobs();

  // 5. API Routes
  app.use('/api', adminRoutes);
  app.use('/api/tests', testRoutes);
  app.use('/api/bookings', bookingRoutes);

  // 4. Error Handling Middlewares
  // Only capture API routes for 404, let Vite handle front-end
  app.use('/api', notFound);
  app.use(errorHandler);

  // 5. Setup Vite for front-end in development, or static in production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // If you need the old vite middleware
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
