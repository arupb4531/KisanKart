import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();

    const pendingFarmers = await User.find({ role: 'farmer', isVerified: false })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    const farmerUserIds = pendingFarmers.map((f: any) => f._id);
    const farmerProfiles = await FarmerProfile.find({ userId: { $in: farmerUserIds } }).lean();

    const profileMap = new Map();
    farmerProfiles.forEach((fp) => profileMap.set(fp.userId.toString(), fp));

    const result = pendingFarmers.map((f: any) => ({
      ...f,
      farmerProfile: profileMap.get(f._id.toString()) || null,
    }));

    return NextResponse.json({ pendingFarmers: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
