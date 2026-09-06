import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, password, phone, role, farmName, farmingMethod, farmLocation, bio, address } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'Name, email, password, and phone are required.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'farmer' ? 'farmer' : role === 'admin' ? 'admin' : 'consumer';
    
    // Farmers start as isVerified: false until admin approval; consumers/admins are true by default
    const isVerified = assignedRole !== 'farmer';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: assignedRole,
      isVerified,
      address: address || {
        street: farmLocation?.address || '',
        city: farmLocation?.city || 'Pune',
        state: farmLocation?.state || 'Maharashtra',
        pincode: farmLocation?.pincode || '411001',
      },
    });

    // If farmer, create default FarmerProfile
    if (assignedRole === 'farmer') {
      await FarmerProfile.create({
        userId: newUser._id,
        farmName: farmName || `${name}'s Agro Farm`,
        farmLocation: {
          address: farmLocation?.address || 'Green Valley Road',
          city: farmLocation?.city || 'Pune',
          state: farmLocation?.state || 'Maharashtra',
          pincode: farmLocation?.pincode || '411001',
          coordinates: [73.8567, 18.5204],
        },
        farmingMethod: farmingMethod || 'organic',
        bio: bio || 'Dedicated to fresh, naturally grown harvest directly from soil to your table.',
        verificationDocs: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop'],
        primaryCrops: ['Vegetables', 'Fruits', 'Grains'],
        experienceYears: 5,
        averageRating: 5.0,
        totalRatings: 0,
      });
    }

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role as any,
      isVerified: newUser.isVerified,
      name: newUser.name,
    });

    const response = NextResponse.json(
      {
        message: 'Account created successfully.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          phone: newUser.phone,
          address: newUser.address,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set('krishi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
