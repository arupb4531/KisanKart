'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      router.push('/marketplace');
    } else {
      setError('Invalid email or password. You can also use the 1-click test buttons below.');
    }
  };

  const handleQuickFill = async (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password123');
    setError('');
    const success = await login(testEmail, 'password123');
    if (success) {
      router.push('/marketplace');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-7 h-7 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-serif">Sign in to KisanKart</h1>
        <p className="text-xs text-slate-500">Access your farm harvests, cart, and delivery tracking.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-soft space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@kisankart.com or consumer@kisankart.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>⚡ 1-Click Demo Accounts</span>
            <span className="text-[10px] text-slate-400">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickFill('consumer@kisankart.com')}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl font-medium border border-blue-200 text-left transition-colors"
            >
              <div className="font-bold">🛒 Consumer</div>
              <div className="text-[10px] text-blue-600">Ananya Sharma</div>
            </button>

            <button
              onClick={() => handleQuickFill('farmer@kisankart.com')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-medium border border-emerald-200 text-left transition-colors"
            >
              <div className="font-bold">👨‍🌾 Farmer (Verified)</div>
              <div className="text-[10px] text-emerald-600">Ramesh Patil</div>
            </button>

            <button
              onClick={() => handleQuickFill('vikram@kisankart.com')}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-medium border border-amber-200 text-left transition-colors"
            >
              <div className="font-bold">⚠️ Farmer (Pending)</div>
              <div className="text-[10px] text-amber-600">Vikram Singh</div>
            </button>

            <button
              onClick={() => handleQuickFill('admin@kisankart.com')}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl font-medium border border-purple-200 text-left transition-colors"
            >
              <div className="font-bold">🛡️ Platform Admin</div>
              <div className="text-[10px] text-purple-600">Rajesh Sharma</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-forest-700 hover:underline">
            Register as Consumer or Farmer
          </Link>
        </div>
      </div>
    </div>
  );
}
