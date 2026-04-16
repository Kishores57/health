import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // Prevent multiple connections in hot-reload (dev) or repeated calls
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // ── Connection Pool ─────────────────────────────────────────────────
      maxPoolSize: 10,       // Max concurrent connections (default: 5)
      minPoolSize: 2,        // Keep at least 2 connections warm
      maxIdleTimeMS: 30_000, // Close idle connections after 30s

      // ── Timeouts ────────────────────────────────────────────────────────
      serverSelectionTimeoutMS: 5_000,  // Give up connecting after 5s
      socketTimeoutMS: 45_000,          // Abort queries that take > 45s
      connectTimeoutMS: 10_000,         // Initial connect timeout

      // ── Reliability ─────────────────────────────────────────────────────
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10_000,     // Check server health every 10s
    });

    isConnected = true;
    console.log(`✅ MongoDB connected → ${conn.connection.host}`);

    // ── Reconnect Handler ─────────────────────────────────────────────────
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected — will auto-reconnect...");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("♻️  MongoDB reconnected ✅");
      isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });
  } catch (err: any) {
    console.error("❌ MongoDB initial connection failed:", err.message);
    process.exit(1);
  }
};