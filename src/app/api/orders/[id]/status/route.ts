import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Must be the farmer of this order or admin
    if (order.farmerId.toString() !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You cannot modify this order status.' }, { status: 403 });
    }

    const { status, paymentStatus } = await req.json();
    const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status value.' }, { status: 400 });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (status === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    return NextResponse.json({
      message: `Order status updated to ${order.status}.`,
      order,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
