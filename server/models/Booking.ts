import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  id: number;
  bookingId: string;
  patientName: string;
  age: number;
  phone: string;
  email: string;
  testIds: number[];
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userId?: string;
  reportUrl?: string;
  reminderSent: boolean;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  id:           { type: Number, unique: true },
  bookingId:    { type: String, required: true, unique: true },
  patientName:  { type: String, required: true },
  age:          { type: Number, required: true },
  phone:        { type: String, required: true },
  email:        { type: String, required: true },
  testIds:      { type: [Number], required: true },
  bookingDate:  { type: String, required: true },
  timeSlot:     { type: String, required: true },
  address:      { type: String, required: true },
  status:       { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  userId:       { type: String },
  reportUrl:    { type: String },
  reminderSent: { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

// ── Performance Indexes ──────────────────────────────────────────────────────
// Slot availability check:  { bookingDate, timeSlot }
BookingSchema.index({ bookingDate: 1, timeSlot: 1 });

// Guest booking tracking:   { phone, bookingId }
BookingSchema.index({ phone: 1, bookingId: 1 });

// Admin filtering by status + sort by newest
BookingSchema.index({ status: 1, createdAt: -1 });

// Cron reminder scan: only pending/unreminded upcoming bookings
BookingSchema.index({ status: 1, reminderSent: 1, bookingDate: 1 });

// Fast ID-based lookups (update status, upload report, delete)
BookingSchema.index({ id: 1 });

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
