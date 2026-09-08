import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { consumerId: auth.userId },
      include: {
        farmer: {
          select: { name: true, email: true, phone: true, address: true, id: true }
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const farmerUserIds = orders.map(o => o.farmerId).filter(Boolean);
    const orderIds = orders.map(o => o.id);

    const [farmerProfiles, reviews] = await Promise.all([
      prisma.farmerProfile.findMany({ where: { userId: { in: farmerUserIds } } }),
      prisma.review.findMany({ where: { orderId: { in: orderIds } } })
    ]);

    const profileMap = new Map();
    farmerProfiles.forEach(fp => profileMap.set(fp.userId, fp));

    const reviewMap = new Map();
    reviews.forEach(r => reviewMap.set(r.orderId, r));

    const enrichedOrders = orders.map(o => ({
      ...o,
      farmerId: o.farmer, // mapping for frontend backwards compatibility
      farmerProfile: profileMap.get(o.farmerId) || null,
      review: reviewMap.get(o.id) || null,
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
