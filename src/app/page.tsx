import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { FarmerProfile } from '@/models/FarmerProfile';
import { User } from '@/models/User';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Truck,
  TrendingUp,
  Award,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Leaf,
  CheckCircle2,
  Search,
  ChevronRight,
  Zap,
} from 'lucide-react';

async function getFeaturedProducts() {
  try {
    await connectToDatabase();
    const products = await Product.find({ isAvailable: true })
      .populate('farmerId', 'name email phone address isVerified avatar')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const farmerIds = products.map((p: any) => p.farmerId?._id).filter(Boolean);
    const farmerProfiles = await FarmerProfile.find({ userId: { $in: farmerIds } }).lean();

    const profileMap = new Map();
    farmerProfiles.forEach((fp) => profileMap.set(fp.userId.toString(), fp));

    const mapped = products.map((p: any) => {
      const farmerUserId = p.farmerId?._id?.toString();
      return {
        ...p,
        _id: p._id.toString(),
        farmerId: p.farmerId
          ? {
              ...p.farmerId,
              _id: p.farmerId?._id?.toString(),
            }
          : null,
        farmerProfile: profileMap.get(farmerUserId) || null,
      };
    });

    return JSON.parse(JSON.stringify(mapped));
  } catch (e) {
    console.error('Error fetching featured products:', e);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  const categories = [
    {
      name: 'Organic Vegetables',
      slug: 'vegetables',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
      count: 'Vine-Fresh Dawn Harvest',
      icon: '🥦',
      tag: 'Zero Pesticides',
    },
    {
      name: 'Orchard Fruits',
      slug: 'fruits',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop',
      count: 'Naturally Tree Ripened',
      icon: '🥭',
      tag: 'Carbide Free',
    },
    {
      name: 'A2 Dairy & Vedic Ghee',
      slug: 'dairy',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop',
      count: 'Free-Grazing Gir Cows',
      icon: '🥛',
      tag: 'Bilona Churned',
    },
    {
      name: 'Heritage Grains & Oils',
      slug: 'grains',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop',
      count: 'Slow Stone Ground',
      icon: '🌾',
      tag: 'Unpolished',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Hero Section with Gradient Mesh */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-forest-950 to-slate-950 text-white py-16 sm:py-24 border-b border-forest-800/40">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-glow-emerald backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DIRECT AGRI GRID 2.0 • ZERO COMMISSIONS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-[1.1] text-white">
                Soil To Spoon.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">
                  Direct From Real Farmers.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl font-light leading-relaxed">
                Connect directly with verified local growers in Pune & Nashik. Experience morning-harvested organic vegetables, raw A2 Gir cow milk, and stone-ground heritage grains delivered to your doorstep within hours.
              </p>

              {/* Action Buttons & Quick Tag Chips */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/marketplace"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-glow-emerald hover:-translate-y-0.5"
                  >
                    <span>Shop Fresh Harvests</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/register?role=farmer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-emerald-500/30 transition-all hover:border-emerald-400/60 shadow-soft"
                  >
                    <Sprout className="w-5 h-5 text-emerald-400" />
                    <span>Join as Verified Producer</span>
                  </Link>
                </div>

                {/* Quick Trending Searches */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs">
                  <span className="text-emerald-400/80 font-medium">Popular Now:</span>
                  <Link
                    href="/marketplace?search=Tomatoes"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors border border-white/10"
                  >
                    🍅 Desi Tomatoes
                  </Link>
                  <Link
                    href="/marketplace?category=dairy"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors border border-white/10"
                  >
                    🥛 Raw A2 Milk
                  </Link>
                  <Link
                    href="/marketplace?search=Mangoes"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors border border-white/10"
                  >
                    🥭 Alphonso Mangoes
                  </Link>
                  <Link
                    href="/marketplace?category=grains"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors border border-white/10"
                  >
                    🌾 Sharbati Atta
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-forest-900 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-300/80 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Geo-Verified Land Holdings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Morning Harvest Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>100% Traceable Farming</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-900/90 to-forest-950/90 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl backdrop-blur-xl animate-float">
                {/* Floating Badge */}
                <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-amber-300">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Live Farm Harvest</span>
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-emerald-500/20">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop"
                    alt="Fresh Harvest"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow border border-emerald-400/40">
                    Harvested 8h ago
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md text-white p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                        <span>Patil Organic Bio Farms</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-sm font-black text-white">Desi Heirloom Tomatoes</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Direct Price</div>
                      <div className="text-base font-black text-amber-300">₹48 / kg</div>
                    </div>
                  </div>
                </div>

                {/* Micro stats inside hero card */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-emerald-500/20">
                    <div className="text-2xl font-black text-emerald-300 font-display">+40%</div>
                    <div className="text-[11px] text-emerald-100/70 font-medium">Farmer Income Boost</div>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-emerald-500/20">
                    <div className="text-2xl font-black text-amber-300 font-display">&lt; 18 hrs</div>
                    <div className="text-[11px] text-emerald-100/70 font-medium">Harvest to Doorstep</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Numbers Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-emerald-100/90 grid grid-cols-2 lg:grid-cols-4 gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">100%</div>
              <div className="text-xs text-slate-500 font-semibold">Direct Farmer Payout</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">400+</div>
              <div className="text-xs text-slate-500 font-semibold">Verified Bio-Acres</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-100">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">0 Days</div>
              <div className="text-xs text-slate-500 font-semibold">Cold Storage Delay</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">4.9 / 5</div>
              <div className="text-xs text-slate-500 font-semibold">Freshness Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Direct From Soil Spectrum
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              Shop by Fresh Category
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace?category=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-950 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border border-slate-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {cat.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Live Featured Harvests Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Live Harvest Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              Fresh Harvests Available Today
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 group"
          >
            <span>View All {products.length}+ Items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-emerald-200">
            <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Harvest Database Ready for Seeding</h3>
            <p className="text-xs text-slate-500 mb-4">Click below to populate rich sample harvest & farmer profiles.</p>
            <Link
              href="/api/seed"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold"
            >
              Seed Sample Produce
            </Link>
          </div>
        )}
      </section>

      {/* 5. Complete 4-Step Direct Supply Chain Architecture */}
      <section className="bg-gradient-to-b from-slate-950 via-forest-950 to-slate-950 py-20 text-white border-y border-forest-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              DIRECT SUPPLY CHAIN ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              How KisanKart Works
            </h2>
            <p className="text-sm text-emerald-100/80 max-w-xl mx-auto font-light">
              From morning dew on village soil to your family dining table within 18 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 hover:border-emerald-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto border border-emerald-500/30 font-display">
                1
              </div>
              <h3 className="text-lg font-bold text-white font-display">Dawn Harvest</h3>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
                Verified growers harvest organic produce and milk A2 Gir cows at 5:00 AM based on live customer demand.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 hover:border-emerald-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto border border-emerald-500/30 font-display">
                2
              </div>
              <h3 className="text-lg font-bold text-white font-display">Quality & Geo-Tagging</h3>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
                Every batch is tagged with harvest timestamp, grower identity, and organic certification standards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 hover:border-emerald-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto border border-emerald-500/30 font-display">
                3
              </div>
              <h3 className="text-lg font-bold text-white font-display">Direct Farm Gate Pickup</h3>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
                Biodegradable crates are loaded straight from farm gates, bypassing middleman mandi commission agents.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 hover:border-emerald-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto border border-emerald-500/30 font-display">
                4
              </div>
              <h3 className="text-lg font-bold text-white font-display">Doorstep & Instant Payout</h3>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
                Delivered fresh by evening. Farmers receive 100% of their listed prices instantly into their bank accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Farmer Trust Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50/60 rounded-3xl p-8 sm:p-12 border border-emerald-200/90 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 aspect-square rounded-3xl overflow-hidden shadow-elevated border-2 border-emerald-200">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop"
                alt="Ramesh Patil"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Featured Producer • 14 Years Certified Organic Bio-Farming</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display leading-snug">
                &ldquo;Selling directly on KisanKart doubled my monthly farm revenue and enabled 60 urban families in Pune to eat 100% pesticide-free produce.&rdquo;
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                — <span className="font-bold text-slate-900">Ramesh Patil</span>, Patil Organic Bio Farms (Saswad Tehsil, Pune). Specializes in vine-ripened desi heirloom tomatoes, cold-pressed mustard oil, and Devgad Alphonso mangoes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/marketplace?search=Tomatoes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-md hover:shadow-glow-emerald"
                >
                  <span>Explore Ramesh&apos;s Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-xs text-slate-600 font-bold bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <span>⭐ 4.9 Rating</span>
                  <span>•</span>
                  <span>18 Verified Deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
