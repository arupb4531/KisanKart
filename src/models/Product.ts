import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDoc extends Document {
  farmerId: mongoose.Types.ObjectId;
  name: string;
  category: 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'pulses' | 'other';
  description: string;
  pricePerUnit: number;
  unit: 'kg' | 'g' | 'litre' | 'dozen' | 'piece' | 'bundle';
  stockQuantity: number;
  harvestDate: Date;
  isOrganic: boolean;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'dairy', 'grains', 'pulses', 'other'],
      required: true,
      default: 'vegetables',
    },
    description: { type: String, default: '' },
    pricePerUnit: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: ['kg', 'g', 'litre', 'dozen', 'piece', 'bundle'],
      required: true,
      default: 'kg',
    },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    harvestDate: { type: Date, required: true, default: Date.now },
    isOrganic: { type: Boolean, default: false },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
