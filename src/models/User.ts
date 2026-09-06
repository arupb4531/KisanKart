import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDoc extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'farmer' | 'consumer' | 'admin';
  isVerified: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['farmer', 'consumer', 'admin'], default: 'consumer' },
    isVerified: { type: Boolean, default: false },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User: Model<IUserDoc> = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
