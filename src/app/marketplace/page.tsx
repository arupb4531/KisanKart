'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IProduct, ProductCategory, FarmingMethod } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Sprout,
  MapPin,
  Check,
  X,
  ArrowUpDown,
  Tag,
  ShieldCheck,
} from 'lucide-react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialOrganic = searchParams.get('isOrganic') === 'true';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [farmingMethod, setFarmingMethod] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [isOrganicOnly, setIsOrganicOnly] = useState(initialOrganic);
  const [sort, setSort] = useState<string>('newest');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (isOrganicOnly) params.set('isOrganic', 'true');
      if (farmingMethod && farmingMethod !== 'all') params.set('farmingMethod', farmingMethod);
      if (city && city !== 'all') params.set('city', city);
      if (search) params.set('search', search);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Error loading products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, isOrganicOnly, farmingMethod, city, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setFarmingMethod('all');
    setCity('all');
    setIsOrganicOnly(false);
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
  };

  const categories = [
    { id: 'all', label: 'All Items', icon: '🧺' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { id: 'fruits', label: 'Fruits', icon: '🥭' },
    { id: 'dairy', label: 'Dairy & Ghee', icon: '🥛' },
    { id: 'grains', label: 'Whole Grains', icon: '🌾' },
    { id: 'pulses', label: 'Pulses & Dals', icon: '🫘' },
    { id: 'other', label: 'Spices & Oils', icon: '🥥' },
  ];

  const activeFiltersCount =
    (category !== 'all' ? 1 : 0) +
    (isOrganicOnly ? 1 : 0) +
    (farmingMethod !== 'all' ? 1 : 0) +
    (city !== 'all' ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Modern Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-forest-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-card border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-glow-emerald">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>DIRECT FARM SOURCING GRID</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Fresh Produce Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-2xl leading-relaxed">
            Every listing is harvested at dawn directly from verified local growers. Zero middlemen markups, 100% grower payout transparency.
          </p>
        </div>
      </div>

      {/* 2. Main Grid: Filter Sidebar + Produce Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>Filter Harvests</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Organic Standard Toggle */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Purity Certification
              </label>
              <button
                onClick={() => setIsOrganicOnly(!isOrganicOnly)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                  isOrganicOnly
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sprout className={`w-4 h-4 ${isOrganicOnly ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>100% Certified Organic</span>
                </div>
                {isOrganicOnly ? (
                  <Check className="w-4 h-4 text-emerald-700 font-black" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </button>
            </div>

            {/* Farming Method Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Farming Technique
              </label>
              <select
                value={farmingMethod}
                onChange={(e) => setFarmingMethod(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              >
                <option value="all">All Farming Methods</option>
                <option value="organic">Organic Bio-Certified</option>
                <option value="natural">Natural / Vedic Vedic Churn</option>
                <option value="conventional">Conventional Farm</option>
              </select>
            </div>

            {/* Region / City Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Grower Hub / Region
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              >
                <option value="all">All Hubs (Pune & Nashik)</option>
                <option value="pune">Pune Belt (Saswad, Baner, Kothrud)</option>
                <option value="nashik">Nashik Region (Dindori, Trimbak)</option>
                <option value="indore">Indore Grain Corridor</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors mt-2 shadow-sm"
              >
                Apply Price Filter
              </button>
            </div>
          </div>
        </div>

        {/* Right Produce Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar & Sort Selector Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full sm:flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search harvests, farm names, or produce..."
                className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Search
              </button>
            </form>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                <option value="newest">Recently Listed</option>
                <option value="harvest_desc">Freshest Harvest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  category === cat.id
                    ? 'bg-forest-800 text-white shadow-md shadow-forest-900/10 scale-102'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Active Search / Filter Tag indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Showing <strong className="text-slate-900 font-bold">{products.length}</strong> fresh harvest listings
            </span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                Filtering by &quot;{search}&quot;
                <button onClick={() => setSearch('')} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Fetching verified farm produce...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-14 text-center border border-dashed border-slate-200 space-y-4">
              <Sprout className="w-14 h-14 text-emerald-500 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">No harvests matching your filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing region and price filters to view all fresh farm listings.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl bg-forest-800 text-white text-xs font-bold shadow-md hover:bg-forest-900 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
