import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string;
  role: 'admin' | 'owner' | 'staff' | 'patient';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth
  role: { type: String, enum: ['admin', 'owner', 'staff', 'patient'], default: 'patient' },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
