import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true, name: true, email: true, phone: true, address: true, isVerified: true, avatar: true, createdAt: true,
            farmerProfile: true,
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        farmerId: product.farmer, // backwards compatibility
        farmerProfile: product.farmer?.farmerProfile || null,
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

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Check ownership or admin
    if (product.farmerId !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, description, pricePerUnit, unit, stockQuantity, harvestDate, isOrganic, images, isAvailable } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (category !== undefined) dataToUpdate.category = category;
    if (description !== undefined) dataToUpdate.description = description;
    if (pricePerUnit !== undefined) dataToUpdate.pricePerUnit = Number(pricePerUnit);
    if (unit !== undefined) dataToUpdate.unit = unit;
    if (stockQuantity !== undefined) {
      dataToUpdate.stockQuantity = Number(stockQuantity);
      dataToUpdate.isAvailable = Number(stockQuantity) > 0;
    }
    if (harvestDate !== undefined) dataToUpdate.harvestDate = new Date(harvestDate);
    if (isOrganic !== undefined) dataToUpdate.isOrganic = Boolean(isOrganic);
    if (images !== undefined) dataToUpdate.images = images;
    if (isAvailable !== undefined) dataToUpdate.isAvailable = Boolean(isAvailable);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ message: 'Product updated successfully.', product: updatedProduct });
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

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    if (product.farmerId !== auth.userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You cannot delete this listing.' }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Product listing removed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
