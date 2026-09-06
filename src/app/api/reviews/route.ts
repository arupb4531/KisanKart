import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Review } from '@/models/Review';
import { Order } from '@/models/Order';
import { FarmerProfile } from '@/models/FarmerProfile';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Please login to submit a review.' }, { status: 401 });
    }

    await connectToDatabase();
    const { orderId, rating, comment } = await req.json();

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Order ID and rating (1-5) are required.' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.consumerId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden: You can only review your own orders.' }, { status: 403 });
    }

    if (order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted after the produce is delivered.' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this order.' }, { status: 409 });
    }

    const review = await Review.create({
      orderId,
      consumerId: auth.userId,
      farmerId: order.farmerId,
      rating: Number(rating),
      comment: comment || '',
    });

    // Update farmer average rating
    const allFarmerReviews = await Review.find({ farmerId: order.farmerId });
    const totalRatings = allFarmerReviews.length;
    const avg = totalRatings > 0
      ? Number((allFarmerReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
      : Number(rating);

    await FarmerProfile.findOneAndUpdate(
      { userId: order.farmerId },
      { averageRating: avg, totalRatings }
    );

    return NextResponse.json(
      { message: 'Review submitted successfully.', review },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
