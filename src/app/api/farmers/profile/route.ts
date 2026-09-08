import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || (auth.role !== 'farmer' && auth.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { farmName, farmLocation, farmingMethod, bio, primaryCrops, experienceYears, verificationDocs, certificates, name, phone } = body;

    // Update User info if provided
    if (name || phone) {
      const userData: any = {};
      if (name) userData.name = name;
      if (phone) userData.phone = phone;
      await prisma.user.update({
        where: { id: auth.userId },
        data: userData
      });
    }

    const profileData: any = {};
    if (farmName) profileData.farmName = farmName;
    if (farmLocation) profileData.farmLocation = farmLocation;
    if (farmingMethod) profileData.farmingMethod = farmingMethod;
    if (bio !== undefined) profileData.bio = bio;
    if (primaryCrops) profileData.primaryCrops = primaryCrops;
    if (experienceYears !== undefined) profileData.experienceYears = Number(experienceYears);
    if (verificationDocs) profileData.verificationDocs = verificationDocs;
    if (certificates) profileData.certificates = certificates;

    const profile = await prisma.farmerProfile.upsert({
      where: { userId: auth.userId },
      update: profileData,
      create: {
        userId: auth.userId,
        farmName: farmName || 'My Farm',
        farmLocation: farmLocation || { address: '', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        farmingMethod: farmingMethod || 'organic',
        ...profileData
      }
    });

    return NextResponse.json({
      message: 'Farmer profile updated successfully.',
      profile,
    });
  } catch (error: any) {
    console.error('Error updating farmer profile:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
