import { z } from "zod";

// Import auth models
export * from "./models/auth";

export const testsSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int(),
  sampleType: z.string(),
  turnaroundTime: z.string(),
  category: z.string(),
  fastingRequired: z.boolean().default(false),
  fastingDuration: z.number().default(0),
  isPostprandial: z.boolean().default(false),
  notificationsEnabled: z.boolean().default(true),
});

export type Test = z.infer<typeof testsSchema>;
export type InsertTest = Omit<Test, "id">;
export const insertTestSchema = testsSchema.omit({ id: true });

export const bookingsSchema = z.object({
  id: z.number(),
  patientName: z.string().min(1),
  age: z.number().int().min(0),
  phone: z.string().min(1),
  email: z.string().email(),
  testIds: z.array(z.number()),
  bookingDate: z.string(),
  timeSlot: z.string(),
  address: z.string(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
  userId: z.string().optional().nullable(),
  createdAt: z.union([z.date(), z.string()]).optional()
});

export type Booking = z.infer<typeof bookingsSchema>;
export type InsertBooking = Omit<Booking, "id" | "createdAt" | "status">;
export const insertBookingSchema = bookingsSchema.omit({ id: true, createdAt: true, status: true });

export const reportsSchema = z.object({
  id: z.number(),
  bookingId: z.number().int(),
  reportUrl: z.string().url(),
  uploadedAt: z.date().optional(),
  status: z.enum(["generated", "reviewed"]).default("generated"),
});

export type Report = z.infer<typeof reportsSchema>;
export type InsertReport = Omit<Report, "id" | "uploadedAt">;
export const insertReportSchema = reportsSchema.omit({ id: true, uploadedAt: true });

// Request/Response Types
export type CreateBookingRequest = InsertBooking;
export type UpdateBookingStatusRequest = { status: "pending" | "confirmed" | "completed" | "cancelled" };

export type BookingResponse = Booking & { tests?: Test[], report?: Report | null };
