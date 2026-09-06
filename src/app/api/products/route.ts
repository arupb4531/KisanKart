import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const isOrganic = searchParams.get('isOrganic');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const farmerId = searchParams.get('farmerId');
    const farmingMethod = searchParams.get('farmingMethod');

    const filter: any = { isAvailable: true };

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (isOrganic === 'true') {
      filter.isOrganic = true;
    }

    if (farmerId) {
      filter.farmerId = farmerId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    // Query products
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'harvest_desc') {
      sortQuery = { harvestDate: -1 };
    } else if (sort === 'price_asc') {
      sortQuery = { pricePerUnit: 1 };
    } else if (sort === 'price_desc') {
      sortQuery = { pricePerUnit: -1 };
    }

    const products = await Product.find(filter)
      .populate('farmerId', 'name email phone address isVerified avatar')
      .sort(sortQuery)
      .lean();

    // Attach farmer profiles for rich metadata
    const farmerIds = products.map((p: any) => p.farmerId?._id).filter(Boolean);
    const farmerProfiles = await FarmerProfile.find({ userId: { $in: farmerIds } }).lean();

    const profileMap = new Map();
    farmerProfiles.forEach((fp) => {
      profileMap.set(fp.userId.toString(), fp);
    });

    let results = products.map((p: any) => {
      const farmerUserId = p.farmerId?._id?.toString();
      return {
        ...p,
        farmerProfile: profileMap.get(farmerUserId) || null,
      };
    });

    // Optional client city filter if city param provided
    if (city && city !== 'all') {
      results = results.filter((p: any) => {
        const farmCity = p.farmerProfile?.farmLocation?.city || p.farmerId?.address?.city;
        return farmCity?.toLowerCase().includes(city.toLowerCase());
      });
    }

    // Optional farmingMethod filter if specified
    if (farmingMethod && farmingMethod !== 'all') {
      results = results.filter((p: any) => {
        const method = p.farmerProfile?.farmingMethod;
        return method?.toLowerCase() === farmingMethod.toLowerCase();
      });
    }

    return NextResponse.json({
      count: results.length,
      products: results,
    });
  } catch (error: any) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || (auth.role !== 'farmer' && auth.role !== 'admin')) {
      return NextResponse.json({ error: 'Only authorized farmers can list produce.' }, { status: 403 });
    }

    await connectToDatabase();

    // Check Verification Gate
    const farmer = await User.findById(auth.userId);
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer user not found.' }, { status: 404 });
    }

    if (!farmer.isVerified && auth.role !== 'admin') {
      return NextResponse.json(
        {
          error:
            'Verification Pending: Your farmer profile is awaiting administrator verification before you can list products.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, category, description, pricePerUnit, unit, stockQuantity, harvestDate, isOrganic, images } = body;

    if (!name || pricePerUnit === undefined || !unit || stockQuantity === undefined) {
      return NextResponse.json(
        { error: 'Name, pricePerUnit, unit, and stockQuantity are required.' },
        { status: 400 }
      );
    }

    const defaultImages = images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop'];

    const newProduct = await Product.create({
      farmerId: farmer._id,
      name,
      category: category || 'vegetables',
      description: description || '',
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'kg',
      stockQuantity: Number(stockQuantity),
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      isOrganic: Boolean(isOrganic),
      images: defaultImages,
      isAvailable: Number(stockQuantity) > 0,
    });

    return NextResponse.json(
      { message: 'Product listed successfully.', product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
