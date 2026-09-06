import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();

    const [
      totalFarmers,
      verifiedFarmers,
      pendingFarmers,
      totalConsumers,
      totalProducts,
      orders,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'farmer', isVerified: true }),
      User.countDocuments({ role: 'farmer', isVerified: false }),
      User.countDocuments({ role: 'consumer' }),
      Product.countDocuments({ isAvailable: true }),
      Order.find({}).lean(),
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
