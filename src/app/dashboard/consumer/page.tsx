'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IOrder } from '@/types';
import { ReviewModal } from '@/components/ReviewModal';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  Star,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ConsumerDashboardPage() {
  const { user, login } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders/my-orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load consumer orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Consumer Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Please sign in to track your farm harvest orders and review growers.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => login('consumer@kisankart.com', 'password123')}
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            1-Click Demo Consumer Login (Ananya)
          </button>
          <Link
            href="/login"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all"
          >
            Sign In with Password
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'confirmed':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-full">
            <span>Consumer Dashboard</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-500">
            {user.email} • {user.address?.city || 'Pune'}
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Shop Fresh Produce</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-forest-700" />
            <h2 className="text-lg font-bold text-slate-900">Your Harvest Orders ({orders.length})</h2>
          </div>
          <button
            onClick={fetchMyOrders}
            className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-forest-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Fetching live orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const farmerObj = order.farmerId;
              const farmerName = farmerObj?.name || 'Local Farmer';
              const farmName = order.farmerProfile?.farmName || `${farmerName}'s Farm`;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-6"
                >
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'confirmed'
                              ? 'bg-forest-100 text-forest-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 font-serif">
                        ₹{order.totalAmount}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                      </div>
                    </div>
                  </div>

                  {/* Multi-Stage Visual Order Timeline Tracker */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            currentStep >= 1 ? 'bg-forest-700 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          1
                        </div>
                        <div className="text-[11px] font-bold text-slate-800">Placed</div>
                        <div className="text-[10px] text-slate-400">Order Sent</div>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            currentStep >= 2 ? 'bg-forest-700 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          2
                        </div>
                        <div className="text-[11px] font-bold text-slate-800">Confirmed</div>
                        <div className="text-[10px] text-slate-400">Harvest Reserved</div>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            currentStep >= 3 ? 'bg-forest-700 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          3
                        </div>
                        <div className="text-[11px] font-bold text-slate-800">Dispatched</div>
                        <div className="text-[10px] text-slate-400">En Route</div>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            currentStep >= 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          4
                        </div>
                        <div className="text-[11px] font-bold text-slate-800">Delivered</div>
                        <div className="text-[10px] text-slate-400">At Doorstep</div>
                      </div>
                    </div>
                  </div>

                  {/* Farm & Slot Info */}
                  <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-slate-500 font-medium">Fulfilling Farm:</div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <span>{farmName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-600">Grower: {farmerName}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 font-medium">Delivery Slot & Address:</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {order.deliverySlot?.timeSlot || 'Morning Slot'}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">Harvest Items:</div>
                    <div className="divide-y divide-slate-100">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800">
                            {item.name} × {item.quantity} {item.unit}
                          </span>
                          <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Button / Rating Display */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {order.review ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-harvest-50 px-3 py-1 rounded-xl border border-harvest-200">
                          <Star className="w-3.5 h-3.5 fill-harvest-400 text-harvest-400" />
                          <span className="font-bold">You rated: {order.review.rating} / 5 Stars</span>
                          <span className="text-slate-400 italic">(&ldquo;{order.review.comment}&rdquo;)</span>
                        </div>
                      ) : order.status === 'delivered' ? (
                        <button
                          onClick={() => setReviewOrder(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Rate Freshness & Grower</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Rating unlocks upon harvest delivery.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-emerald-200 space-y-4">
            <Package className="w-12 h-12 text-forest-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Browse our fresh agricultural catalog to place your first direct farm order.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          isOpen={Boolean(reviewOrder)}
          onClose={() => setReviewOrder(null)}
          orderId={reviewOrder._id}
          farmerName={reviewOrder.farmerProfile?.farmName || reviewOrder.farmerId?.name || 'Local Farm'}
          onSubmitted={() => fetchMyOrders()}
        />
      )}
    </div>
  );
}
