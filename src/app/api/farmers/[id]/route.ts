import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true, role: true, isVerified: true, address: true, avatar: true, createdAt: true
      }
    });

    if (!user || user.role !== 'farmer') {
      return NextResponse.json({ error: 'Farmer profile not found.' }, { status: 404 });
    }

    const farmerProfile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
    const products = await prisma.product.findMany({ where: { farmerId: user.id, isAvailable: true } });
    const reviews = await prisma.review.findMany({
      where: { farmerId: user.id },
      include: {
        consumer: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({
      farmer: {
        ...user,
        farmerProfile,
      },
      products,
      reviews: reviews.map((r: any) => ({
        ...r,
        consumerId: r.consumer, // backwards compatibility
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
