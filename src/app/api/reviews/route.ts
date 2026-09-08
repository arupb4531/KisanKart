import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Please login to submit a review.' }, { status: 401 });
    }

    const { orderId, rating, comment } = await req.json();

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Order ID and rating (1-5) are required.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.consumerId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden: You can only review your own orders.' }, { status: 403 });
    }

    if (order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted after the produce is delivered.' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({ where: { orderId } });
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this order.' }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        consumerId: auth.userId,
        farmerId: order.farmerId,
        rating: Number(rating),
        comment: comment || '',
      }
    });

    // Update farmer average rating
    const aggregate = await prisma.review.aggregate({
      where: { farmerId: order.farmerId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    
    const avg = aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : Number(rating);
    const totalRatings = aggregate._count.rating;

    // We use updateMany here just in case the profile doesn't exist yet so it doesn't throw
    await prisma.farmerProfile.updateMany({
      where: { userId: order.farmerId },
      data: { averageRating: avg, totalRatings }
    });

    return NextResponse.json(
      { message: 'Review submitted successfully.', review },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
