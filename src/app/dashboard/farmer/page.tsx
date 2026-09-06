'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IProduct, IOrder, ProductCategory, ProductUnit, FarmingMethod } from '@/types';
import {
  Sprout,
  Package,
  Plus,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Clock,
  Star,
  CheckCircle2,
  Trash2,
  Edit,
  RefreshCw,
  X,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { user, farmerProfile, login, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'profile'>('inventory');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('vegetables');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState<ProductUnit>('kg');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdHarvestDate, setNewProdHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProdIsOrganic, setNewProdIsOrganic] = useState(true);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);
  const [addError, setAddError] = useState('');

  // Profile Edit state
  const [farmName, setFarmName] = useState(farmerProfile?.farmName || '');
  const [farmingMethod, setFarmingMethod] = useState<FarmingMethod>(farmerProfile?.farmingMethod || 'organic');
  const [farmAddress, setFarmAddress] = useState(farmerProfile?.farmLocation?.address || '');
  const [farmCity, setFarmCity] = useState(farmerProfile?.farmLocation?.city || 'Pune');
  const [farmState, setFarmState] = useState(farmerProfile?.farmLocation?.state || 'Maharashtra');
  const [farmPincode, setFarmPincode] = useState(farmerProfile?.farmLocation?.pincode || '412301');
  const [bio, setBio] = useState(farmerProfile?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const fetchFarmerData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch products listed by this farmer
      const farmerUserId = user._id || user.id;
      const prodRes = await fetch(`/api/products?farmerId=${farmerUserId}`);
      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData.products || []);
      }

      // Fetch farmer orders
      const ordRes = await fetch('/api/orders/farmer-orders');
      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData.orders || []);
      }
    } catch (e) {
      console.error('Error loading farmer data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'farmer') {
      fetchFarmerData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (farmerProfile) {
      setFarmName(farmerProfile.farmName || '');
      setFarmingMethod(farmerProfile.farmingMethod || 'organic');
      setFarmAddress(farmerProfile.farmLocation?.address || '');
      setFarmCity(farmerProfile.farmLocation?.city || 'Pune');
      setFarmState(farmerProfile.farmLocation?.state || 'Maharashtra');
      setFarmPincode(farmerProfile.farmLocation?.pincode || '412301');
      setBio(farmerProfile.bio || '');
    }
  }, [farmerProfile]);

  if (!user || user.role !== 'farmer') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Farmer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Please sign in as a farmer to manage listings and fulfill orders.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => login('farmer@kisankart.com', 'password123')}
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            1-Click Demo Farmer (Ramesh Patil - Verified)
          </button>
          <button
            onClick={() => login('vikram@kisankart.com', 'password123')}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            1-Click Demo Farmer (Vikram - Pending Verification)
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!user.isVerified) {
      setAddError('Verification Pending: Your profile must be verified by an admin before you can list produce.');
      return;
    }

    setIsSubmittingProd(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          pricePerUnit: Number(newProdPrice),
          unit: newProdUnit,
          stockQuantity: Number(newProdStock),
          harvestDate: newProdHarvestDate,
          isOrganic: newProdIsOrganic,
          description: newProdDesc,
          images: newProdImage ? [newProdImage] : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdStock('');
        setNewProdDesc('');
        setNewProdImage('');
        fetchFarmerData();
      } else {
        setAddError(data.error || 'Failed to list product.');
      }
    } catch (err: any) {
      setAddError(err.message || 'Error listing product.');
    } finally {
      setIsSubmittingProd(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchFarmerData();
      }
    } catch (e) {
      console.error('Error updating order status:', e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this harvest listing?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFarmerData();
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');

    try {
      const res = await fetch('/api/farmers/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmName,
          farmingMethod,
          farmLocation: {
            address: farmAddress,
            city: farmCity,
            state: farmState,
            pincode: farmPincode,
          },
          bio,
        }),
      });

      if (res.ok) {
        setProfileMsg('✅ Farm profile updated successfully!');
        await refreshProfile();
        setTimeout(() => setProfileMsg(''), 3000);
      } else {
        setProfileMsg('Failed to update profile.');
      }
    } catch (err: any) {
      setProfileMsg('Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Verification Alert Gate Banner */}
      {!user.isVerified ? (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950">
                Farm Verification Under Review (Verification Gate Active)
              </h3>
              <p className="text-xs text-amber-800">
                Your farm profile and submitted documents are awaiting administrator approval. Product creation is restricted until verification is complete.
              </p>
            </div>
          </div>
          <div className="text-xs text-amber-900 bg-amber-100/70 p-3 rounded-xl flex items-center justify-between">
            <span>Tip: Switch to <strong>Admin Role</strong> in top bar to approve this account instantly!</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Verified Farmer Producer Account • {farmerProfile?.farmName || user.name}</span>
          </div>
          <span className="bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
            ACTIVE & VERIFIED
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            {farmerProfile?.farmName || `${user.name}'s Farm Portal`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grower: {user.name} • {farmerProfile?.farmLocation?.city || 'Pune'} • {farmerProfile?.farmingMethod?.toUpperCase() || 'ORGANIC'}
          </p>
        </div>

        {user.isVerified && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>List New Dawn Harvest</span>
          </button>
        )}
      </div>

      {/* Top 4 Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales (GMV)</div>
          <div className="text-2xl font-black text-slate-900 font-serif">₹{totalRevenue}</div>
          <div className="text-[11px] text-emerald-700 font-medium">100% Direct Payout</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</div>
          <div className="text-2xl font-black text-slate-900 font-serif">{pendingOrdersCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting fulfillment</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Produce</div>
          <div className="text-2xl font-black text-slate-900 font-serif">{products.length}</div>
          <div className="text-[11px] text-forest-700 font-medium">Listed in marketplace</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer Rating</div>
          <div className="text-2xl font-black text-slate-900 font-serif flex items-center gap-1">
            <Star className="w-5 h-5 fill-harvest-400 text-harvest-400" />
            <span>{farmerProfile?.averageRating || 5.0}</span>
          </div>
          <div className="text-[11px] text-slate-500">{farmerProfile?.totalRatings || 0} reviews</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'inventory'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Produce & Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Incoming Orders ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Farm Settings & Coordinates
        </button>
      </div>

      {/* Tab 1: Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Harvest Catalog</h2>
            {user.isVerified && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            )}
          </div>

          {products.length > 0 ? (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Produce</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / Unit</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Harvest Date</th>
                      <th className="p-4">Organic</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.isAvailable ? '🟢 Active' : '🔴 Sold Out'}</div>
                          </div>
                        </td>
                        <td className="p-4 font-medium uppercase text-slate-600 text-[11px]">{p.category}</td>
                        <td className="p-4 font-bold text-slate-900">₹{p.pricePerUnit} / {p.unit}</td>
                        <td className="p-4 font-semibold text-slate-800">{p.stockQuantity} {p.unit}</td>
                        <td className="p-4 text-slate-600">{new Date(p.harvestDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          {p.isOrganic ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              100% Organic
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Conventional</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-emerald-200 space-y-3">
              <Sprout className="w-10 h-10 text-forest-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">No Produce Listed Yet</div>
              <p className="text-xs text-slate-500">
                {user.isVerified
                  ? 'Click "List New Dawn Harvest" above to post your vegetables, fruits, dairy, or grains.'
                  : 'Product listing is currently disabled until administrator verification is approved.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Customer Harvest Orders ({orders.length})</h2>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm font-mono">{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'confirmed'
                              ? 'bg-forest-100 text-forest-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Customer: <span className="font-semibold text-slate-800">{ord.consumerId?.name}</span> (📞 {ord.consumerId?.phone})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 font-serif">₹{ord.totalAmount}</div>
                      <div className="text-[11px] text-slate-500">{ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</div>
                    </div>
                  </div>

                  {/* Delivery & Items info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                      <div className="font-bold text-slate-700">Delivery Slot & Address:</div>
                      <div className="text-slate-600 font-semibold">{ord.deliverySlot?.timeSlot || 'Morning Slot'}</div>
                      <div className="text-slate-500">
                        {ord.shippingAddress?.street}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                      <div className="font-bold text-slate-700">Harvest Items to Pack:</div>
                      {ord.items?.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-slate-600">
                          <span>{it.name} × {it.quantity} {it.unit}</span>
                          <span className="font-bold">₹{it.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Progression Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {ord.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'confirmed')}
                        className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        ✓ Accept & Confirm Harvest
                      </button>
                    )}
                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'dispatched')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        🚚 Mark Out for Delivery (Dispatched)
                      </button>
                    )}
                    {ord.status === 'dispatched' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, 'delivered')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        🎉 Mark Delivered (Handed Over)
                      </button>
                    )}
                    {ord.status === 'delivered' && (
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fulfillment Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-emerald-200 space-y-2">
              <Package className="w-10 h-10 text-forest-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">No Orders Received Yet</div>
              <p className="text-xs text-slate-500">Orders placed by consumers will appear here in real time.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Farm Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-soft max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Farm Details & Sustainable Practices
          </h3>

          {profileMsg && (
            <div className="p-3 bg-forest-50 border border-forest-200 text-forest-900 text-xs rounded-xl font-medium">
              {profileMsg}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm / Estate Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farming Method</label>
              <select
                value={farmingMethod}
                onChange={(e) => setFarmingMethod(e.target.value as FarmingMethod)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white font-medium"
              >
                <option value="organic">Organic Bio-Certified</option>
                <option value="natural">Natural / Vedic (Jeevamrutha)</option>
                <option value="conventional">Conventional Farm</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm Location / Tehsil</label>
                <input
                  type="text"
                  value={farmAddress}
                  onChange={(e) => setFarmAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  value={farmCity}
                  onChange={(e) => setFarmCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm Bio & Story</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="py-3 px-6 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {savingProfile ? 'Saving...' : 'Update Farm Profile'}
            </button>
          </div>
        </form>
      )}

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-elevated border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">List New Dawn Harvest</h3>
            <p className="text-xs text-slate-500 mb-4">Post freshly harvested agricultural produce directly to consumers.</p>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Produce Name</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Farm Fresh Organic Desi Tomatoes"
                  required
                  className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="grains">Grains</option>
                    <option value="pulses">Pulses</option>
                    <option value="other">Cold-Pressed Oils / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value as ProductUnit)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="litre">litre</option>
                    <option value="dozen">dozen</option>
                    <option value="bundle">bundle</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price per Unit (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="48"
                    required
                    min="1"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="100"
                    required
                    min="1"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={newProdHarvestDate}
                    onChange={(e) => setNewProdHarvestDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProdIsOrganic}
                      onChange={(e) => setNewProdIsOrganic(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">100% Organic Certified</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Harvest Notes</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Vine-ripened, handpicked at 5 AM..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProd}
                className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-2xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmittingProd ? 'Publishing Listing...' : 'Publish Produce Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
