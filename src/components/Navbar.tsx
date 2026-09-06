'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { DemoSwitcherModal } from './DemoSwitcherModal';
import {
  Sprout,
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  Menu,
  X,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, totalAmount } = useCart();
  const router = useRouter();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getDashboardUrl = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/dashboard/farmer';
    if (user.role === 'admin') return '/dashboard/admin';
    return '/dashboard/consumer';
  };

  const getRoleBadge = () => {
    if (!user) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100/90 text-slate-700 hover:bg-slate-200 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Guest View
        </span>
      );
    }
    if (user.role === 'farmer') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs transition-all ${
            user.isVerified
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}
        >
          {user.isVerified ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          )}
          Farmer {user.isVerified ? '(Verified)' : '(Pending)'}
        </span>
      );
    }
    if (user.role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Platform Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Consumer
      </span>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-all">
        {/* Top announcement & quick role helper bar */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-emerald-200 text-[11px] sm:text-xs py-1.5 px-4 border-b border-forest-800/60">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                100% DIRECT
              </span>
              <span className="hidden sm:inline font-medium text-emerald-100">
                Direct Farm-to-Fork Supply Chain • Fair Producer Pricing & Zero Intermediary Cuts
              </span>
              <span className="sm:hidden font-medium text-emerald-100">Direct Farm-to-Consumer Grid</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-harvest-300 hover:text-white font-medium transition-colors bg-forest-800/80 hover:bg-forest-800 px-2.5 py-0.5 rounded-full border border-forest-700/60"
              >
                <SlidersHorizontal className="w-3 h-3 text-harvest-400" />
                <span>Switch Persona</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-forest-800 via-forest-700 to-emerald-600 text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-glow-emerald group-hover:scale-105">
                <Sprout className="w-6 h-6 text-emerald-200 group-hover:rotate-6 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display leading-none">
                  Kisan<span className="text-emerald-600">Kart</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
                  Agri Marketplace
                </span>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-2 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh tomatoes, A2 Gir cow milk, Alphonso mangoes..."
                  className="w-full pl-11 pr-24 py-2.5 text-xs sm:text-sm bg-slate-100/70 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold text-slate-700">
              <Link
                href="/marketplace"
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/marketplace?category=vegetables"
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                Vegetables
              </Link>
              <Link
                href="/marketplace?category=dairy"
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                A2 Dairy
              </Link>
              <Link
                href="/marketplace?isOrganic=true"
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 font-bold"
              >
                <span>🌿 100% Organic</span>
              </Link>
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Indicator Button */}
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="hidden lg:inline-flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                title="Click to switch role"
              >
                {getRoleBadge()}
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 text-forest-950 font-bold text-xs sm:text-sm transition-all border border-emerald-200/80 shadow-soft hover:shadow-glow-emerald"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-forest-800 text-white text-[10px] font-black rounded-full shadow-sm animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                {totalAmount > 0 && (
                  <span className="hidden md:inline text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    ₹{totalAmount}
                  </span>
                )}
              </Link>

              {/* User Dashboard / Auth Links */}
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href={getDashboardUrl()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-900 hover:to-forest-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-forest-900/10 hover:shadow-glow-emerald"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="p-2 sm:p-2.5 text-slate-500 hover:text-red-600 rounded-2xl hover:bg-slate-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-forest-800 hover:bg-forest-900 text-white rounded-2xl transition-all shadow-md hover:shadow-glow-emerald"
                  >
                    Join Free
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-700 rounded-2xl hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drop */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl p-4 sm:p-6 space-y-4 animate-fade-in shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search harvests..."
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-2xl"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </form>

            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
              <Link
                href="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Browse Marketplace</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/marketplace?category=vegetables"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
              >
                <span>🥦 Fresh Vegetables</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/marketplace?category=fruits"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
              >
                <span>🍎 Orchard Fruits</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/marketplace?category=dairy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
              >
                <span>🥛 A2 Gir Cow Milk & Ghee</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/marketplace?isOrganic=true"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-between"
              >
                <span>🌿 100% Certified Organic</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-700 underline"
              >
                Switch Role Persona
              </button>
              {getRoleBadge()}
            </div>
          </div>
        )}
      </header>

      {/* Demo Persona Modal */}
      <DemoSwitcherModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  );
}
