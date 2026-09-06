import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewDoc extends Document {
  orderId: mongoose.Types.ObjectId;
  consumerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    consumerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Review: Model<IReviewDoc> =
  mongoose.models.Review || mongoose.model<IReviewDoc>('Review', ReviewSchema);
