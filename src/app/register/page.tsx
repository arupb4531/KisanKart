'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sprout, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { FarmingMethod } from '@/types';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'consumer';

  const [role, setRole] = useState<'consumer' | 'farmer'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Farmer specific fields
  const [farmName, setFarmName] = useState('');
  const [farmingMethod, setFarmingMethod] = useState<FarmingMethod>('organic');
  const [farmAddress, setFarmAddress] = useState('');
  const [farmCity, setFarmCity] = useState('Pune');
  const [farmState, setFarmState] = useState('Maharashtra');
  const [farmPincode, setFarmPincode] = useState('411001');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload: any = {
      name,
      email,
      password,
      phone,
      role,
    };

    if (role === 'farmer') {
      payload.farmName = farmName || `${name}'s Agro Farm`;
      payload.farmingMethod = farmingMethod;
      payload.farmLocation = {
        address: farmAddress,
        city: farmCity,
        state: farmState,
        pincode: farmPincode,
      };
      payload.bio = bio;
    } else {
      payload.address = {
        street: farmAddress || 'Green Valley Road',
        city: farmCity || 'Pune',
        state: farmState || 'Maharashtra',
        pincode: farmPincode || '411001',
      };
    }

    const res = await register(payload);
    setSubmitting(false);

    if (res.success) {
      if (role === 'farmer') {
        router.push('/dashboard/farmer');
      } else {
        router.push('/marketplace');
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-7 h-7 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-serif">Create KisanKart Account</h1>
        <p className="text-xs text-slate-500">Join our transparent direct agricultural marketplace.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-soft space-y-6">
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'consumer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛒 I want to buy produce (Consumer)
          </button>

          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'farmer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍🌾 I am a grower (Farmer)
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 12345"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
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
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Farmer Specific Fields */}
          {role === 'farmer' && (
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="font-bold text-forest-900 text-xs">Farm / Agricultural Profile</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Farm Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Patil Organic Bio Farms"
                    required
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Farming Method</label>
                  <select
                    value={farmingMethod}
                    onChange={(e) => setFarmingMethod(e.target.value as FarmingMethod)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
                  >
                    <option value="organic">Organic Bio-Certified</option>
                    <option value="natural">Natural / Vedic (Jeevamrutha)</option>
                    <option value="conventional">Conventional Farm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Tehsil</label>
                  <input
                    type="text"
                    value={farmCity}
                    onChange={(e) => setFarmCity(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={farmState}
                    onChange={(e) => setFarmState(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={farmPincode}
                    onChange={(e) => setFarmPincode(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm Bio & Crops</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mention your primary crops, farming practices, and natural inputs..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? 'Creating account...' : `Register as ${role === 'farmer' ? 'Farmer Producer' : 'Consumer'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-forest-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
