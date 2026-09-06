import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || (auth.role !== 'farmer' && auth.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { farmName, farmLocation, farmingMethod, bio, primaryCrops, experienceYears, verificationDocs, certificates, name, phone } = body;

    // Update User info if provided
    if (name || phone) {
      const user = await User.findById(auth.userId);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        await user.save();
      }
    }

    let profile = await FarmerProfile.findOne({ userId: auth.userId });
    if (!profile) {
      profile = new FarmerProfile({
        userId: auth.userId,
        farmName: farmName || 'My Farm',
        farmLocation: farmLocation || { address: '', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        farmingMethod: farmingMethod || 'organic',
      });
    }

    if (farmName) profile.farmName = farmName;
    if (farmLocation) profile.farmLocation = farmLocation;
    if (farmingMethod) profile.farmingMethod = farmingMethod;
    if (bio !== undefined) profile.bio = bio;
    if (primaryCrops) profile.primaryCrops = primaryCrops;
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears);
    if (verificationDocs) profile.verificationDocs = verificationDocs;
    if (certificates) profile.certificates = certificates;

    await profile.save();

    return NextResponse.json({
      message: 'Farmer profile updated successfully.',
      profile,
    });
  } catch (error: any) {
    console.error('Error updating farmer profile:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
