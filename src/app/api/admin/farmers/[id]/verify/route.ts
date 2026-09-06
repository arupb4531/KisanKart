import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();
    const { isVerified } = await req.json();

    const user = await User.findById(id);
    if (!user || user.role !== 'farmer') {
      return NextResponse.json({ error: 'Farmer account not found.' }, { status: 404 });
    }

    user.isVerified = Boolean(isVerified);
    await user.save();

    return NextResponse.json({
      message: `Farmer ${user.name} has been ${user.isVerified ? 'verified & approved' : 'rejected / unverified'}.`,
      farmer: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
