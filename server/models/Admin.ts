import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password?: string;
  role: 'owner';
  createdAt: Date;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner'], default: 'owner' },
  createdAt: { type: Date, default: Date.now },
});

export const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);
