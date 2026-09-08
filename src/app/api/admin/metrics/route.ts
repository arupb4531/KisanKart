import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const [
      totalFarmers,
      verifiedFarmers,
      pendingFarmers,
      totalConsumers,
      totalProducts,
      orders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'farmer' } }),
      prisma.user.count({ where: { role: 'farmer', isVerified: true } }),
      prisma.user.count({ where: { role: 'farmer', isVerified: false } }),
      prisma.user.count({ where: { role: 'consumer' } }),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.order.findMany(),
    ]);

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
    const dispatchedOrders = orders.filter((o) => o.status === 'dispatched').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    const gmv = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const fulfillmentRate = totalOrders > 0
      ? Math.round((deliveredOrders / (totalOrders - cancelledOrders || 1)) * 100)
      : 100;

    return NextResponse.json({
      metrics: {
        gmv,
        totalOrders,
        deliveredOrders,
        pendingOrders,
        confirmedOrders,
        dispatchedOrders,
        cancelledOrders,
        fulfillmentRate,
        totalFarmers,
        verifiedFarmers,
        pendingFarmers,
        totalConsumers,
        totalProducts,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
