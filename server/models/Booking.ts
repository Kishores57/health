import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  id: number;
  bookingId: string; // The text-based BKG-123456
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
  reportUrl?: string; // Appended for report uploads
  reminderSent: boolean;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  id: { type: Number, unique: true },
  bookingId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  testIds: { type: [Number], required: true },
  bookingDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  userId: { type: String }, // Optional link to registered user
  reportUrl: { type: String },
  reminderSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
