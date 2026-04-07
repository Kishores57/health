import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
// import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth"; // Import auth setup
import { setupAuth } from "./auth";
import { z } from "zod";
import { sendBookingConfirmation, sendReportNotification } from "./mailer";
import { sendWhatsAppFastingAlert } from "./whatsapp";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Auth
  setupAuth(app);

  // === SEED DATA ===
  const adminExists = await storage.getUserByUsername("admin");
  if (!adminExists) {
    await storage.createUser({
      username: "admin",
      password: await bcrypt.hash("admin", 10),
      firstName: "Admin",
      lastName: "User",
      email: "admin@medilab.com",
      role: "admin",
    });
    console.log("Seeded admin user");
  }

  const ownerExists = await storage.getUserByUsername("owner");
  if (!ownerExists) {
    await storage.createUser({
      username: "owner",
      password: await bcrypt.hash("owner", 10),
      firstName: "Lab",
      lastName: "Owner",
      email: "owner@medilab.com",
      role: "owner",
    });
    console.log("Seeded owner user");
  }

  const existingTests = await storage.getTests();
  if (existingTests.length <= 5) {
    if (existingTests.length > 0) {
      const { TestModel } = await import("./models/Test");
      await TestModel.deleteMany({});
      const Counter = mongoose.models.Counter || mongoose.model("Counter", new mongoose.Schema({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } }));
      if (Counter) await Counter.findByIdAndDelete("testId");
    }

    // Seed Tests (Fasting Required)
    await storage.createTest({ name: "Lipid Profile", description: "Measures cholesterol and triglycerides", price: 120000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Heart Health", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Fasting Blood Sugar (FBS)", description: "Measures blood glucose after an overnight fast", price: 30000, sampleType: "Blood", turnaroundTime: "12 hours", category: "Diabetes", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Iron Studies / Serum Iron", description: "Measures iron levels in the blood", price: 150000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Deficiency", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Liver Function Test (LFT)", description: "Evaluates liver health", price: 180000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Organ Function", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Kidney Function Test (KFT/RFT)", description: "Evaluates kidney health", price: 170000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Organ Function", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Fasting Insulin Test", description: "Measures insulin levels after fasting", price: 150000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Diabetes", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Vitamin B12 Test", description: "Measures Vitamin B12 levels", price: 200000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Vitamins", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Serum Folate", description: "Measures folate (Vitamin B9) levels", price: 180000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Vitamins", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Uric Acid Test", description: "Measures uric acid levels in the blood", price: 40000, sampleType: "Blood", turnaroundTime: "12 hours", category: "Bone Health", fastingRequired: true, fastingDuration: 6, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Basic Metabolic Panel (BMP)", description: "Measures glucose, calcium, and electrolytes", price: 250000, sampleType: "Blood", turnaroundTime: "24 hours", category: "General Health", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Cortisol (Morning Test)", description: "Measures cortisol levels in the morning", price: 180000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Hormones", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Growth Hormone Test", description: "Measures growth hormone levels", price: 220000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Hormones", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true });

    // Seed Tests (No Fasting Required)
    await storage.createTest({ name: "HbA1c", description: "Average blood sugar over the past 2-3 months", price: 80000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Diabetes", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Thyroid Profile (TSH, T3, T4)", description: "Evaluates thyroid gland function", price: 140000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Hormones", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Complete Blood Count (CBC)", description: "Evaluates overall health and detects a wide range of disorders", price: 50000, sampleType: "Blood", turnaroundTime: "12 hours", category: "General Health", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true });
    await storage.createTest({ name: "Vitamin D", description: "Measures Vitamin D levels for bone health", price: 190000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Vitamins", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true });

    console.log("Seeded tests database with full list of tests");
  }

  // === API ROUTES ===

  // Tests
  app.get(api.tests.list.path, async (req, res) => {
    const tests = await storage.getTests();
    res.json(tests);
  });

  app.get(api.tests.get.path, async (req, res) => {
    const test = await storage.getTest(Number(req.params.id));
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  });

  app.post(api.tests.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "owner") {
      return res.status(401).json({ message: "Unauthorized: Lab Owner access required." });
    }
    try {
      const input = api.tests.create.input.parse(req.body);
      const test = await storage.createTest(input);
      res.status(201).json(test);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.tests.update.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "owner") {
      return res.status(401).json({ message: "Unauthorized: Lab Owner access required." });
    }
    try {
      const input = api.tests.update.input.parse(req.body);
      const test = await storage.updateTest(Number(req.params.id), input);
      res.json(test);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Bookings
  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);

      // Fire email asynchronously
      sendBookingConfirmation(input.email, input).catch(console.error);

      // Fire WhatsApp notification if any test requires fasting
      for (const testId of input.testIds) {
        const test = await storage.getTest(testId);
        if (test?.fastingRequired) {
          sendWhatsAppFastingAlert(input.phone, test.name, test.fastingDuration).catch(console.error);
        }
      }

      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.bookings.list.path, async (req, res) => {
    // In a real app, protect this route with authentication (Admin only)
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

  app.get(api.bookings.get.path, async (req, res) => {
    const booking = await storage.getBooking(Number(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Simple check: if not logged in, maybe only allow by special token or just public for now (simplified)
    // Ideally: if (req.user.id !== booking.userId && !req.user.isAdmin) return 403;
    res.json(booking);
  });

  app.patch(api.bookings.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { status } = req.body;
    const booking = await storage.updateBookingStatus(Number(req.params.id), status);
    res.json(booking);
  });

  // Reports
  app.post(api.reports.upload.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.reports.upload.input.parse(req.body);
      const report = await storage.createReport(input as any);

      // Fire email notification
      const booking = await storage.getBooking(input.bookingId);
      if (booking && booking.email) {
        sendReportNotification(booking.email, input.reportUrl).catch(console.error);
      }

      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.reports.get.path, async (req, res) => {
    const report = await storage.getReport(Number(req.params.id));
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  });

  return httpServer;
}
