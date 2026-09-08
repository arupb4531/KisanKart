import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const pendingFarmers = await prisma.user.findMany({
      where: { role: 'farmer', isVerified: false },
      select: {
        id: true, name: true, email: true, phone: true, role: true, isVerified: true, address: true, avatar: true, createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const farmerUserIds = pendingFarmers.map((f: any) => f.id);
    const farmerProfiles = await prisma.farmerProfile.findMany({ where: { userId: { in: farmerUserIds } } });

    const profileMap = new Map();
    farmerProfiles.forEach((fp) => profileMap.set(fp.userId, fp));

    const result = pendingFarmers.map((f: any) => ({
      ...f,
      _id: f.id, // backwards compatibility
      farmerProfile: profileMap.get(f.id) || null,
    }));

    return NextResponse.json({ pendingFarmers: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
