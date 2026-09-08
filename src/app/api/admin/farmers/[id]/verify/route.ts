import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { isVerified } = await req.json();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'farmer') {
      return NextResponse.json({ error: 'Farmer account not found.' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isVerified: Boolean(isVerified) }
    });

    return NextResponse.json({
      message: `Farmer ${updatedUser.name} has been ${updatedUser.isVerified ? 'verified & approved' : 'rejected / unverified'}.`,
      farmer: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
