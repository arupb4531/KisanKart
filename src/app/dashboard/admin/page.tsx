'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Users,
  Sprout,
  TrendingUp,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, login } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [mRes, fRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/farmers/pending'),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData.metrics);
      }

      if (fRes.ok) {
        const fData = await fRes.json();
        setPendingFarmers(fData.pendingFarmers || []);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Admin Governance Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access is restricted to authorized platform administrators.
          </p>
        </div>
        <button
          onClick={() => login('admin@kisankart.com', 'password123')}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
        >
          1-Click Demo Admin Login (Rajesh Sharma)
        </button>
      </div>
    );
  }

  const handleVerifyFarmer = async (farmerId: string, isVerified: boolean) => {
    try {
      setActionMsg('Processing verification status...');
      const res = await fetch(`/api/admin/farmers/${farmerId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMsg(`✅ ${data.message}`);
        fetchAdminData();
        setTimeout(() => setActionMsg(''), 4000);
      } else {
        setActionMsg(`Error: ${data.error}`);
      }
    } catch (e) {
      setActionMsg('Error updating farmer status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">
            KisanKart Control Center
          </h1>
          <p className="text-xs text-slate-500">
            Administrator: {user.name} • {user.email}
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3.5 bg-forest-50 border border-forest-200 text-forest-900 text-xs rounded-2xl font-medium">
          {actionMsg}
        </div>
      )}

      {/* Platform Analytics KPI Grid */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gross Merchandise Value (GMV)
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              ₹{metrics.gmv}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">100% Direct Farmer Realization</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fulfillment Rate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {metrics.fulfillmentRate}%
            </div>
            <div className="text-[11px] text-forest-700 font-medium">
              {metrics.deliveredOrders} of {metrics.totalOrders} orders completed
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-soft space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Onboarded Farmers
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {metrics.totalFarmers}
            </div>
            <div className="text-[11px] text-purple-700 font-medium">
              {metrics.verifiedFarmers} Verified • {metrics.pendingFarmers} Pending
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-soft space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Consumers
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {metrics.totalConsumers}
            </div>
            <div className="text-[11px] text-blue-700 font-medium">
              {metrics.totalProducts} active harvest listings
            </div>
          </div>
        </div>
      )}

      {/* Verification Queue Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pending Farmer Verification Queue ({pendingFarmers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review landholding coordinates & organic certification docs before approving marketplace listing privileges.
            </p>
          </div>
        </div>

        {pendingFarmers.length > 0 ? (
          <div className="space-y-4">
            {pendingFarmers.map((f) => (
              <div
                key={f._id}
                className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                      Awaiting Verification
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Farm:</strong> {f.farmerProfile?.farmName || `${f.name}'s Farm`} •{' '}
                    <strong>Location:</strong> {f.farmerProfile?.farmLocation?.city || f.address?.city},{' '}
                    {f.farmerProfile?.farmLocation?.state || f.address?.state} (Pincode: {f.farmerProfile?.farmLocation?.pincode || f.address?.pincode})
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Method:</strong>{' '}
                    <span className="capitalize font-semibold text-emerald-800">
                      {f.farmerProfile?.farmingMethod || 'Organic'}
                    </span>{' '}
                    • <strong>Phone:</strong> {f.phone} • <strong>Email:</strong> {f.email}
                  </div>

                  {f.farmerProfile?.verificationDocs && f.farmerProfile.verificationDocs.length > 0 && (
                    <div className="pt-1 flex items-center gap-2 text-xs">
                      <FileText className="w-3.5 h-3.5 text-forest-700" />
                      <a
                        href={f.farmerProfile.verificationDocs[0]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest-700 hover:text-forest-900 font-semibold underline flex items-center gap-1"
                      >
                        <span>View Submitted Land Certificate / APMC ID</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 1-Click Verification Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleVerifyFarmer(f._id, true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>

                  <button
                    onClick={() => handleVerifyFarmer(f._id, false)}
                    className="px-3.5 py-2.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800">All Farmer Applications Cleared!</div>
            <p>No pending verification requests at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
