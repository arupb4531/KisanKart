import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFarmerProfileDoc extends Document {
  userId: mongoose.Types.ObjectId;
  farmName: string;
  farmLocation: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: [number, number];
  };
  farmingMethod: 'organic' | 'conventional' | 'natural';
  bio?: string;
  primaryCrops?: string[];
  experienceYears?: number;
  verificationDocs?: string[];
  certificates?: string[];
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerProfileSchema = new Schema<IFarmerProfileDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmName: { type: String, required: true, trim: true },
    farmLocation: {
      address: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: [{ type: Number }], // [lng, lat]
    },
    farmingMethod: {
      type: String,
      enum: ['organic', 'conventional', 'natural'],
      required: true,
      default: 'organic',
    },
    bio: { type: String, default: '' },
    primaryCrops: [{ type: String }],
    experienceYears: { type: Number, default: 1 },
    verificationDocs: [{ type: String }],
    certificates: [{ type: String }],
    averageRating: { type: Number, default: 5.0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FarmerProfile: Model<IFarmerProfileDoc> =
  mongoose.models.FarmerProfile || mongoose.model<IFarmerProfileDoc>('FarmerProfile', FarmerProfileSchema);
