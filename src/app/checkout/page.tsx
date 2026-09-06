'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Truck,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalAmount, totalItems, groupedByFarmer, clearCart } = useCart();
  const { user, login } = useAuth();
  const router = useRouter();

  // Delivery slot states
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const day3 = new Date();
  day3.setDate(day3.getDate() + 3);

  const availableDates = [
    { label: 'Tomorrow', date: tomorrow.toISOString().split('T')[0], formatted: tomorrow.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) },
    { label: 'Day After', date: dayAfter.toISOString().split('T')[0], formatted: dayAfter.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) },
    { label: 'In 3 Days', date: day3.toISOString().split('T')[0], formatted: day3.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) },
  ];

  const timeSlots = [
    { id: '07:00 AM - 10:00 AM', label: 'Morning Fresh (07:00 AM - 10:00 AM)', tag: 'Recommended' },
    { id: '12:00 PM - 03:00 PM', label: 'Afternoon (12:00 PM - 03:00 PM)', tag: '' },
    { id: '05:00 PM - 08:00 PM', label: 'Evening (05:00 PM - 08:00 PM)', tag: '' },
  ];

  const [selectedDate, setSelectedDate] = useState(availableDates[0].date);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0].id);

  // Address
  const [street, setStreet] = useState(user?.address?.street || 'Flat 402, Green Acre Heights, Baner Road');
  const [city, setCity] = useState(user?.address?.city || 'Pune');
  const [state, setState] = useState(user?.address?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.address?.pincode || '411045');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successOrders, setSuccessOrders] = useState<any[] | null>(null);

  if (items.length === 0 && !successOrders) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your basket is empty</h2>
        <Link href="/marketplace" className="inline-flex px-5 py-2.5 bg-forest-700 text-white rounded-xl text-xs font-bold">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Ensure user is authenticated
    if (!user) {
      setError('Please sign in or use 1-click Demo Login below to complete your farm order.');
      return;
    }

    if (!street || !city || !pincode) {
      setError('Please provide a complete shipping address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          unitPrice: i.pricePerUnit,
          quantity: i.quantity,
          unit: i.unit,
        })),
        deliverySlot: {
          date: selectedDate,
          timeSlot: selectedSlot,
        },
        shippingAddress: {
          street,
          city,
          state,
          pincode,
        },
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessOrders(data.orders);
        clearCart();
      } else {
        setError(data.error || 'Failed to place order.');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async () => {
    await login('consumer@kisankart.com', 'password123');
    setStreet('Flat 402, Green Acre Heights, Baner Road');
    setCity('Pune');
    setState('Maharashtra');
    setPincode('411045');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
          Direct Farm Delivery Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select delivery slot & shipping address for your morning harvest fulfillment.
        </p>
      </div>

      {/* Success Modal */}
      {successOrders && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-300 shadow-elevated text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Order Confirmed & Sent to Farmer!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your harvest has been reserved. The grower will harvest and pack fresh produce for your selected slot.
            </p>
          </div>

          {/* Generated Order Numbers */}
          <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 text-xs text-left space-y-2">
            <div className="font-bold text-slate-800">
              Confirmed Sub-Orders ({successOrders.length}):
            </div>
            {successOrders.map((ord: any) => (
              <div key={ord._id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold text-forest-900">{ord.orderNumber}</span>
                <span className="text-slate-500">
                  ₹{ord.totalAmount} • {ord.paymentMethod.toUpperCase()} ({ord.status})
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/consumer"
              className="w-full sm:w-auto px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Track Order on Consumer Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {!successOrders && (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Auth Notification if not signed in */}
            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">You are currently checking out as Guest.</span> Sign in or 1-click test login as Consumer.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="px-4 py-2 bg-forest-700 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm"
                >
                  1-Click Consumer Login
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Delivery Slot Picker */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-forest-700" />
                <h3 className="text-sm font-bold text-slate-900">1. Select Preferred Delivery Slot</h3>
              </div>

              {/* Date selection pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Delivery Date</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDate === d.date
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] font-medium text-slate-500">{d.label}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{d.formatted}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time window selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700">Time Window</label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        selectedSlot === slot.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${selectedSlot === slot.id ? 'text-forest-700' : 'text-slate-400'}`} />
                        <span>{slot.label}</span>
                      </div>
                      {slot.tag && (
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                          {slot.tag}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-forest-700" />
                <h3 className="text-sm font-bold text-slate-900">2. Shipping Address</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street / Apartment / Society</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="e.g. Flat 402, Green Acre Heights, Baner Road"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Mode */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-forest-700" />
                <h3 className="text-sm font-bold text-slate-900">3. Payment Mode</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold">Instant Online (UPI / Card)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Direct simulated payment with instant digital receipt.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-4 h-4 text-forest-700" />
                    <span className="text-xs font-bold">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Pay directly when fresh harvest is handed to you.</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Checkout Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Fulfillment Summary
              </h3>

              {/* Farmer count note */}
              <div className="p-3 bg-forest-50 border border-forest-100 rounded-2xl text-xs text-forest-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-forest-700 flex-shrink-0" />
                <span>
                  Items will be prepared by <span className="font-bold">{Object.keys(groupedByFarmer).length} local farm(s)</span>.
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
                {Object.entries(groupedByFarmer).map(([farm, farmItems]) => (
                  <div key={farm} className="pt-2">
                    <div className="font-bold text-slate-900">{farm}</div>
                    <div className="text-[11px] text-slate-500">
                      {farmItems.map((fi) => `${fi.name} (${fi.quantity} ${fi.unit})`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Handling</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t">
                  <span>Total Amount</span>
                  <span className="text-forest-900 font-serif">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-2xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving with Farm...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero middlemen • 100% Direct Payout</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
