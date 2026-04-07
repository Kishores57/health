import mongoose from "mongoose";
import { type Test, type InsertTest, type Booking, type InsertBooking, type Report, type InsertReport } from "@shared/schema";
import { type User, type InsertUser } from "@shared/models/auth";
import { UserModel } from "./models/User";
import { TestModel } from "./models/Test";
import { BookingModel } from "./models/Booking";
import { ReportModel } from "./models/Report";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTests(): Promise<Test[]>;
  getTest(id: number): Promise<Test | undefined>;
  createTest(test: InsertTest): Promise<Test>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<(Booking & { tests: Test[] })[]>;
  getBooking(id: number): Promise<(Booking & { tests: Test[]; report: Report | null }) | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReportByBookingId(bookingId: number): Promise<Report | undefined>;
  updateTest(id: number, testPatch: Partial<InsertTest>): Promise<Test>;
}

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const seqDoc = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return seqDoc.seq;
}

export class MongoStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? (doc as unknown as User) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ username }).lean();
    return doc ? (doc as unknown as User) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? (doc as unknown as User) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await getNextSequenceValue("userId");
    const doc = new UserModel({ ...insertUser, id });
    await doc.save();
    return doc.toObject() as unknown as User;
  }

  async getTests(): Promise<Test[]> {
    const docs = await TestModel.find().lean();
    return docs as unknown as Test[];
  }

  async getTest(id: number): Promise<Test | undefined> {
    const doc = await TestModel.findOne({ id }).lean();
    return doc ? (doc as unknown as Test) : undefined;
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const id = await getNextSequenceValue("testId");
    const doc = new TestModel({ ...insertTest, id });
    await doc.save();
    return doc.toObject() as unknown as Test;
  }

  async updateTest(id: number, testPatch: Partial<InsertTest>): Promise<Test> {
    const doc = await TestModel.findOneAndUpdate({ id }, { $set: testPatch }, { new: true }).lean();
    if (!doc) throw new Error("Test not found");
    return doc as unknown as Test;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = await getNextSequenceValue("bookingId");
    const doc = new BookingModel({ ...insertBooking, id });
    await doc.save();
    return doc.toObject() as unknown as Booking;
  }

  async getBookings(): Promise<(Booking & { tests: Test[] })[]> {
    const docs = await BookingModel.find().lean();
    const results = [];
    for (const d of docs) {
      const b = d as unknown as Booking;
      const tests = await TestModel.find({ id: { $in: b.testIds } }).lean() as unknown as Test[];
      results.push({ ...b, tests });
    }
    return results;
  }

  async getBooking(id: number): Promise<(Booking & { tests: Test[]; report: Report | null }) | undefined> {
    const doc = await BookingModel.findOne({ id }).lean();
    if (!doc) return undefined;
    const b = doc as unknown as Booking;
    const tests = await TestModel.find({ id: { $in: b.testIds } }).lean() as unknown as Test[];
    const reportDoc = await ReportModel.findOne({ bookingId: id }).lean();
    const report = reportDoc ? (reportDoc as unknown as Report) : null;
    return { ...b, tests, report };
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const doc = await BookingModel.findOneAndUpdate({ id }, { $set: { status } }, { new: true }).lean();
    if (!doc) throw new Error("Booking not found");
    return doc as unknown as Booking;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = await getNextSequenceValue("reportId");
    const doc = new ReportModel({ ...insertReport, id });
    await doc.save();
    return doc.toObject() as unknown as Report;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const doc = await ReportModel.findOne({ id }).lean();
    return doc ? (doc as unknown as Report) : undefined;
  }

  async getReportByBookingId(bookingId: number): Promise<Report | undefined> {
    const doc = await ReportModel.findOne({ bookingId }).lean();
    return doc ? (doc as unknown as Report) : undefined;
  }
}

export const storage = new MongoStorage();
