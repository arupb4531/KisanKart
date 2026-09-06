'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IProduct, IFarmerProfile, IUser } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import {
  ShieldCheck,
  MapPin,
  Sprout,
  Star,
  Award,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

export default function FarmerProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/farmers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFarmer(data.farmer);
          setProducts(data.products || []);
          setReviews(data.reviews || []);
        }
      } catch (e) {
        console.error('Failed to load farmer profile:', e);
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
        <p className="text-xs text-slate-500 font-medium">Loading farmer story & certifications...</p>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Farmer Not Found</h2>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700 text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const profile: IFarmerProfile = farmer.farmerProfile;
  const farmName = profile?.farmName || `${farmer.name}'s Farm`;

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

      {/* Farm Header Hero Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-950 to-forest-900 rounded-3xl p-6 sm:p-10 text-white shadow-soft border border-forest-800">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-forest-800 border-2 border-emerald-300 shadow-md flex-shrink-0">
            <img
              src={farmer.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
              alt={farmer.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Verified Agricultural Producer</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-xs font-semibold border border-forest-700">
                <Sprout className="w-3.5 h-3.5" />
                <span className="capitalize">{profile?.farmingMethod || 'Organic'} Practice</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight">
              {farmName}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-emerald-200/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>
                  {profile?.farmLocation?.address || farmer.address?.street},{' '}
                  {profile?.farmLocation?.city || farmer.address?.city},{' '}
                  {profile?.farmLocation?.state || farmer.address?.state}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-harvest-400 text-harvest-400" />
                <span className="font-bold text-white">{profile?.averageRating || 5.0}</span>
                <span>({profile?.totalRatings || reviews.length} verified ratings)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-3xl leading-relaxed pt-1">
              {profile?.bio || 'Dedicated to traditional zero-chemical farming and fresh sunrise harvesting.'}
            </p>
          </div>
        </div>
      </div>

      {/* Certifications & Farm Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Farming Experience
          </div>
          <div className="text-xl font-bold text-slate-900">
            {profile?.experienceYears || 5}+ Years of Cultivation
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Verified Certifications
          </div>
          <div className="text-xs font-semibold text-emerald-800 space-y-1">
            {profile?.certificates && profile.certificates.length > 0 ? (
              profile.certificates.map((c, i) => <div key={i}>✓ {c}</div>)
            ) : (
              <div>✓ Jaivik Bharat NPOP Standards</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            GPS Geotagged Location
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Lat: {profile?.farmLocation?.coordinates?.[1] || 18.5204}° N
            <br />
            Lng: {profile?.farmLocation?.coordinates?.[0] || 73.8567}° E
          </div>
        </div>
      </div>

      {/* Produce Listed by this Farmer */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Current Fresh Harvests ({products.length})
            </h2>
            <p className="text-xs text-slate-500">Listed directly by {farmer.name}</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={{ ...p, farmerId: farmer, farmerProfile: profile }} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-emerald-200">
            <Sprout className="w-10 h-10 text-forest-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No active harvests listed at the moment.</p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-t-0 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-forest-700" />
            <h3 className="text-lg font-bold text-slate-900">Verified Consumer Reviews ({reviews.length})</h3>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
            <Star className="w-4 h-4 fill-harvest-400 text-harvest-400" />
            <span>{profile?.averageRating || 5.0} / 5.0 Average</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                      {rev.consumerId?.name?.[0] || 'C'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rev.consumerId?.name || 'Verified Consumer'}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= s ? 'fill-harvest-400 text-harvest-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No reviews recorded yet for this farm.</p>
        )}
      </div>
    </div>
  );
}
