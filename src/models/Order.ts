import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItemDoc {
  productId: mongoose.Types.ObjectId;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  subtotal: number;
  image?: string;
}

export interface IOrderDoc extends Document {
  orderNumber: string;
  consumerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  items: IOrderItemDoc[];
  totalAmount: number;
  deliverySlot: {
    date: Date;
    timeSlot: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDoc>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true },
  subtotal: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    consumerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    deliverySlot: {
      date: { type: Date, required: true },
      timeSlot: { type: String, required: true, default: '08:00 AM - 11:00 AM' },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);
