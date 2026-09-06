'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sprout,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItems, groupedByFarmer, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-forest-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Your Farm Cart is Empty</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Discover today&apos;s fresh harvests directly from verified local growers in Pune & Nashik.
          </p>
        </div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Sprout className="w-4 h-4 text-emerald-300" />
          <span>Explore Fresh Produce</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Farm Basket ({totalItems} items)
          </h1>
          <p className="text-xs text-slate-500">
            Produce is grouped by source farm for direct farm-to-table traceability.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Grouped by Farmer items */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(groupedByFarmer).map(([farmName, farmItems]) => (
            <div
              key={farmName}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-soft space-y-4"
            >
              {/* Farm Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {farmName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Direct fulfillment • {farmItems.length} harvest item(s)
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-forest-800">
                  Subtotal: ₹{farmItems.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0)}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {farmItems.map((item) => (
                  <div key={item.productId} className="py-3 flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-forest-50 flex-shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                      <div className="text-xs text-slate-500">
                        ₹{item.pricePerUnit} per {item.unit}
                        {item.isOrganic && (
                          <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Organic
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-sm font-bold text-slate-900 w-16 text-right">
                      ₹{item.pricePerUnit * item.quantity}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Produce Total ({totalItems} items)</span>
                <span className="font-semibold text-slate-900">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Delivery Handling</span>
                <span className="text-emerald-700 font-semibold">FREE (Direct)</span>
              </div>
              <div className="flex justify-between">
                <span>Intermediary Commission</span>
                <span className="text-emerald-700 font-semibold">₹0 (Zero Middlemen)</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                <span>Total Payout</span>
                <span className="text-forest-900 font-serif">₹{totalAmount}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <span>Proceed to Delivery & Slot Selection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5 text-forest-700" />
              <span>Morning fresh delivery directly to your door</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
