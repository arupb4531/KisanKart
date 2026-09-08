import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || (auth.role !== 'farmer' && auth.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { farmerId: auth.userId },
      include: {
        consumer: {
          select: { name: true, email: true, phone: true, address: true, avatar: true }
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const mappedOrders = orders.map(o => ({
      ...o,
      consumerId: o.consumer // frontend compat
    }));

    return NextResponse.json({ orders: mappedOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
