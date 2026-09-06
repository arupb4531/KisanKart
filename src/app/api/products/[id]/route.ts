import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { FarmerProfile } from '@/models/FarmerProfile';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await Product.findById(id)
      .populate('farmerId', 'name email phone address isVerified avatar createdAt')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const farmerUserId = (product.farmerId as any)?._id;
    const farmerProfile = farmerUserId ? await FarmerProfile.findOne({ userId: farmerUserId }).lean() : null;

    return NextResponse.json({
      product: {
        ...product,
        farmerProfile,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Check ownership or admin
    if (product.farmerId.toString() !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, description, pricePerUnit, unit, stockQuantity, harvestDate, isOrganic, images, isAvailable } = body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (pricePerUnit !== undefined) product.pricePerUnit = Number(pricePerUnit);
    if (unit !== undefined) product.unit = unit;
    if (stockQuantity !== undefined) {
      product.stockQuantity = Number(stockQuantity);
      product.isAvailable = Number(stockQuantity) > 0;
    }
    if (harvestDate !== undefined) product.harvestDate = new Date(harvestDate);
    if (isOrganic !== undefined) product.isOrganic = Boolean(isOrganic);
    if (images !== undefined) product.images = images;
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);

    await product.save();

    return NextResponse.json({ message: 'Product updated successfully.', product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    if (product.farmerId.toString() !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You cannot delete this listing.' }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product listing removed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
