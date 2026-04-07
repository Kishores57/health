import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  bookingId: number; // reference to Booking
  reportUrl: string;
  uploadedAt: Date;
  status: 'generated' | 'reviewed';
}

const ReportSchema: Schema = new Schema({
  id: { type: Number, unique: true },
  bookingId: { type: Number, required: true },
  reportUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['generated', 'reviewed'], default: 'generated' },
});

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);
