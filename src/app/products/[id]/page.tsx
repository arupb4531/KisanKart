'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { HarvestFreshnessBadge } from '@/components/HarvestFreshnessBadge';
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowLeft,
  Check,
  Sprout,
  Calendar,
  Clock,
  Star,
  RefreshCw,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-forest-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading direct farm harvest details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">This harvest listing might be sold out or no longer active.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700 text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const farmerObj = typeof product.farmerId === 'object' ? product.farmerId : null;
  const farmerName = farmerObj?.name || 'Local Farmer';
  const farmerCity = product.farmerProfile?.farmLocation?.city || farmerObj?.address?.city || 'Pune';
  const farmName = product.farmerProfile?.farmName || `${farmerName}'s Farm`;
  const farmerUserId = farmerObj?._id || product.farmerId;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-forest-50 border border-emerald-100 shadow-soft">
            <img
              src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <HarvestFreshnessBadge harvestDate={product.harvestDate} />
            </div>
            {product.isOrganic && (
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Certified Organic</span>
              </div>
            )}
          </div>

          {/* Thumbnail list if multiple */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-forest-700 scale-105 shadow-sm' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
              <span className="bg-forest-50 px-2.5 py-1 rounded-lg">{product.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                {farmerCity}, Maharashtra
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif mb-2">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-forest-900 font-serif">
                ₹{product.pricePerUnit}
              </span>
              <span className="text-sm font-medium text-slate-500">
                per {product.unit} (Direct Farmer Price)
              </span>
            </div>
          </div>

          {/* Harvest & Quality Metadata */}
          <div className="bg-forest-50/70 border border-forest-100 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-forest-700" />
                <span>Harvest Date</span>
              </div>
              <div className="font-bold text-slate-900">
                {new Date(product.harvestDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-500 font-medium flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-forest-700" />
                <span>Available Stock</span>
              </div>
              <div className="font-bold text-slate-900">
                {product.stockQuantity > 0 ? (
                  <span className="text-emerald-700">
                    {product.stockQuantity} {product.unit} available
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Harvest Notes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description || 'Harvested directly from certified farms with zero chemical residues or artificial wax coatings.'}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center shadow-xs"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">
                  {quantity} {product.unit}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center shadow-xs"
                >
                  +
                </button>
              </div>
              <div className="text-sm font-bold text-forest-900 ml-auto">
                Subtotal: ₹{product.pricePerUnit * quantity}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAdd}
                disabled={product.stockQuantity <= 0}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : product.stockQuantity <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-forest-700 hover:bg-forest-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="py-3.5 px-4 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Farmer Trust Spotlight Card */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-forest-100 border">
                  <img
                    src={(farmerObj as any)?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                    alt={farmerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {farmName}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Grower: <span className="font-semibold text-slate-700">{farmerName}</span> • {farmerCity}
                  </div>
                </div>
              </div>

              <Link
                href={`/farmers/${farmerUserId}`}
                className="px-3 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold rounded-xl transition-colors"
              >
                View Farm
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {product.farmerProfile?.bio ||
                'Committed to chemical-free agriculture, natural bio-composting, and fresh dawn harvesting.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-harvest-400 text-harvest-400" />
                <span className="font-bold text-slate-800">
                  {product.farmerProfile?.averageRating || 5.0} Rating
                </span>
              </div>
              <span>•</span>
              <div className="capitalize font-medium text-emerald-800">
                Method: {product.farmerProfile?.farmingMethod || 'Organic'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
