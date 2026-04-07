import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  id: number;
  name: string;
  description: string;
  price: number;
  sampleType: string;
  turnaroundTime: string;
  category: string;
  fastingRequired: boolean;
  fastingDuration: number;
  isPostprandial: boolean;
  notificationsEnabled: boolean;
}

const TestSchema: Schema = new Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // in cents
  sampleType: { type: String, required: true },
  turnaroundTime: { type: String, required: true },
  category: { type: String, required: true },
  fastingRequired: { type: Boolean, default: false },
  fastingDuration: { type: Number, default: 0 },
  isPostprandial: { type: Boolean, default: false },
  notificationsEnabled: { type: Boolean, default: true },
});

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

TestSchema.pre('save', async function() {
  if (this.isNew && !this.id) {
    const counter = await Counter.findByIdAndUpdate(
      'testId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.id = counter.seq;
    }
  }
});

export const TestModel = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);
