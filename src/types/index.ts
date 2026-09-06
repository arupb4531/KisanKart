export type UserRole = 'farmer' | 'consumer' | 'admin';
export type FarmingMethod = 'organic' | 'conventional' | 'natural';
export type ProductCategory = 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'pulses' | 'other';
export type ProductUnit = 'kg' | 'g' | 'litre' | 'dozen' | 'piece' | 'bundle';
export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  address?: Address;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFarmerProfile {
  _id: string;
  userId: string | IUser;
  farmName: string;
  farmLocation: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: [number, number];
  };
  farmingMethod: FarmingMethod;
  bio?: string;
  primaryCrops?: string[];
  experienceYears?: number;
  verificationDocs?: string[];
  certificates?: string[];
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  farmerId: string | IUser;
  name: string;
  category: ProductCategory;
  description: string;
  pricePerUnit: number;
  unit: ProductUnit;
  stockQuantity: number;
  harvestDate: string;
  isOrganic: boolean;
  images: string[];
  isAvailable: boolean;
  farmerProfile?: IFarmerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: ProductUnit;
  subtotal: number;
  image?: string;
}

export interface IDeliverySlot {
  date: string;
  timeSlot: string; // e.g., '07:00 AM - 10:00 AM'
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  consumerId: string | IUser;
  farmerId: string | IUser;
  items: IOrderItem[];
  totalAmount: number;
  deliverySlot: IDeliverySlot;
  shippingAddress: Address;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  orderId: string;
  consumerId: string | IUser;
  farmerId: string | IUser;
  productId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    phone?: string;
    address?: Address;
  };
  token: string;
}
