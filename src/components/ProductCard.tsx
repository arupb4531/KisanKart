'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { HarvestFreshnessBadge } from './HarvestFreshnessBadge';
import { ShoppingBag, Check, ShieldCheck, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

interface Props {
  product: IProduct;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const farmerObj = typeof product.farmerId === 'object' ? product.farmerId : null;
  const farmerName = farmerObj?.name || 'Local Farmer';
  const farmerCity = product.farmerProfile?.farmLocation?.city || farmerObj?.address?.city || 'Pune';
  const farmName = product.farmerProfile?.farmName || `${farmerName}'s Farm`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  // Estimated traditional supermarket retail markup (+35%)
  const estimatedRetail = Math.round(product.pricePerUnit * 1.35);

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-1.5">
      {/* Image Container with Badges */}
      <Link href={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay for Tag Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          <HarvestFreshnessBadge harvestDate={product.harvestDate} />
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-sm border border-emerald-400/40">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              Organic
            </span>
          )}
        </div>

        {/* Stock Alert / Savings Chip */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.stockQuantity <= 10 && product.stockQuantity > 0 ? (
            <div className="bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Only {product.stockQuantity} {product.unit} left
            </div>
          ) : (
            <div className="bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Dawn Harvest
            </div>
          )}
          <span className="text-[10px] font-bold text-white/90 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md">
            Save ~{Math.round(((estimatedRetail - product.pricePerUnit) / estimatedRetail) * 100)}% vs Retail
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Category & Location Header */}
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="uppercase tracking-wider text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-100 font-bold">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{farmerCity}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product._id}`} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1 font-display">
            {product.name}
          </h3>
        </Link>

        {/* Farmer Profile Snippet */}
        <Link
          href={`/farmers/${typeof product.farmerId === 'object' ? (product.farmerId as any)._id : product.farmerId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-800 mb-2.5 transition-colors group/farmer"
        >
          <span className="font-semibold text-slate-700 group-hover/farmer:text-emerald-700">{farmName}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {product.description || 'Farm-fresh organic harvest sourced directly with zero intermediate markups.'}
        </p>

        {/* Pricing & Add to Cart Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 font-display">
                ₹{product.pricePerUnit}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ {product.unit}</span>
            </div>
            <div className="text-[10px] text-slate-400 line-through">
              Retail: ₹{estimatedRetail}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stockQuantity <= 0}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-sm ${
              added
                ? 'bg-emerald-600 text-white scale-105 shadow-glow-emerald'
                : product.stockQuantity <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-forest-800 hover:bg-forest-900 text-white hover:shadow-md hover:scale-102 active:scale-98'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added!</span>
              </>
            ) : product.stockQuantity <= 0 ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
