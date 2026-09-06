'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserCheck, Shield, ShoppingCart, RefreshCw, X, Sprout, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoSwitcherModal({ isOpen, onClose }: Props) {
  const { user, switchDemoUser } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSwitch = async (role: 'farmer' | 'farmer_pending' | 'consumer' | 'admin') => {
    await switchDemoUser(role);
    setMessage(`Switched active persona to ${role.toUpperCase()}`);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 600);
  };

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setMessage('Resetting and populating fresh demo database...');
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setMessage('✅ Database seeded! Refreshing...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage('Seed completed with note. Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (e) {
      setMessage('Seed triggered.');
      setTimeout(() => window.location.reload(), 1000);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-elevated border border-emerald-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Role & Persona Switcher</h3>
            <p className="text-xs text-slate-500">Test different user perspectives in KisanKart with 1 click</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-forest-50 border border-forest-200 text-forest-900 text-xs rounded-xl font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Role options */}
        <div className="space-y-2.5 mb-6">
          {/* Consumer */}
          <button
            onClick={() => handleSwitch('consumer')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
              user?.role === 'consumer'
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Consumer (Ananya Sharma)
                  {user?.role === 'consumer' && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">Browse fresh produce, cart, slots, order tracking & reviews</div>
              </div>
            </div>
          </button>

          {/* Farmer - Verified */}
          <button
            onClick={() => handleSwitch('farmer')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
              user?.role === 'farmer' && user?.isVerified
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Farmer - Verified (Ramesh Patil)
                  {user?.role === 'farmer' && user?.isVerified && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">Manage listings, farm profile, fulfill customer orders & revenue</div>
              </div>
            </div>
          </button>

          {/* Farmer - Pending Verification */}
          <button
            onClick={() => handleSwitch('farmer_pending')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
              user?.role === 'farmer' && !user?.isVerified
                ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Farmer - Unverified (Vikram Singh)
                  {user?.role === 'farmer' && !user?.isVerified && (
                    <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">Tests verification gate restriction before admin approves</div>
              </div>
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => handleSwitch('admin')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
              user?.role === 'admin'
                ? 'bg-purple-50/70 border-purple-500 shadow-sm'
                : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Platform Admin (Rajesh Sharma)
                  {user?.role === 'admin' && (
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">Approve farmer registrations, view GMV, platform analytics</div>
              </div>
            </div>
          </button>
        </div>

        {/* Database Re-seed button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">Need Fresh Data?</div>
            <div className="text-[11px] text-slate-500">Re-populate sample harvest & orders</div>
          </div>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding...' : 'Reset Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
