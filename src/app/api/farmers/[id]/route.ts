import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const user = await User.findById(id).select('-passwordHash').lean();
    if (!user || user.role !== 'farmer') {
      return NextResponse.json({ error: 'Farmer profile not found.' }, { status: 404 });
    }

    const farmerProfile = await FarmerProfile.findOne({ userId: user._id }).lean();
    const products = await Product.find({ farmerId: user._id, isAvailable: true }).lean();
    const reviews = await Review.find({ farmerId: user._id })
      .populate('consumerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      farmer: {
        ...user,
        farmerProfile,
      },
      products,
      reviews,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
