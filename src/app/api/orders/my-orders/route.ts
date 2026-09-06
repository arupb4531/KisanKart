import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { FarmerProfile } from '@/models/FarmerProfile';
import { Review } from '@/models/Review';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ consumerId: auth.userId })
      .populate('farmerId', 'name email phone address')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch farmer profiles and reviews
    const farmerUserIds = orders.map((o: any) => o.farmerId?._id).filter(Boolean);
    const orderIds = orders.map((o: any) => o._id);

    const [farmerProfiles, reviews] = await Promise.all([
      FarmerProfile.find({ userId: { $in: farmerUserIds } }).lean(),
      Review.find({ orderId: { $in: orderIds } }).lean(),
    ]);

    const profileMap = new Map();
    farmerProfiles.forEach((fp) => profileMap.set(fp.userId.toString(), fp));

    const reviewMap = new Map();
    reviews.forEach((r) => reviewMap.set(r.orderId.toString(), r));

    const enrichedOrders = orders.map((o: any) => {
      const farmerUserId = o.farmerId?._id?.toString();
      return {
        ...o,
        farmerProfile: profileMap.get(farmerUserId) || null,
        review: reviewMap.get(o._id.toString()) || null,
      };
    });

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
