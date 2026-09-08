import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Must be the farmer of this order or admin
    if (order.farmerId !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You cannot modify this order status.' }, { status: 403 });
    }

    const { status, paymentStatus } = await req.json();
    const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status value.' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;
    if (status === 'delivered' && order.paymentMethod === 'cod') {
      dataToUpdate.paymentStatus = 'paid';
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({
      message: `Order status updated to ${updatedOrder.status}.`,
      order: updatedOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
