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

const isProduction = process.env.NODE_ENV === "production";

// ── Security: Trust proxy (required for Railway / reverse proxies) ──────────
app.set("trust proxy", 1);

// ── CORS ────────────────────────────────────────────────────────────────────
// In production, only allow same-origin requests (Express serves the frontend)
// In development, allow all origins for Vite HMR
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL || ""].filter(Boolean)
  : true; // true = all origins in dev

app.use(
  cors({
    origin: allowedOrigins as any,
    credentials: true,
  })
);

// ── Body Parsers ─────────────────────────────────────────────────────────────
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Uploads directory (created at runtime, not tracked in git) ───────────────
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// ── Request Logger ────────────────────────────────────────────────────────────
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
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// ── DB Initialization for Serverless ──────────────────────────────────────────
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await connectDB();
      await initAdmin();
      await initTests();
      if (!process.env.VERCEL) {
        setupCronJobs();
      }
      isInitialized = true;
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }
  next();
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check — used by keep-alive ping and Railway health probes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown API routes
app.use("/api", notFound);
app.use(errorHandler);

// ── Bootstrap (Local / Standard Node) ─────────────────────────────────────────
if (!process.env.VERCEL) {
  (async () => {
    // Serve frontend
    if (isProduction) {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen({ port, host: "0.0.0.0" }, () => {
      log(`serving on port ${port}`);
    });
  })();
}

export default app;
