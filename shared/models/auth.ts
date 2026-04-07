import { z } from "zod";

export const usersSchema = z.object({
  id: z.number(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  role: z.enum(["admin", "owner", "staff", "patient"]).default("patient"),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof usersSchema>;
export type InsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpsertUser = InsertUser;
