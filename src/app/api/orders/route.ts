import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Please login to place an order.' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { items, deliverySlot, shippingAddress, paymentMethod } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    if (!deliverySlot || !deliverySlot.date || !deliverySlot.timeSlot) {
      return NextResponse.json({ error: 'Please select a valid delivery slot date and time.' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return NextResponse.json({ error: 'Please provide a complete delivery address.' }, { status: 400 });
    }

    // Step 1: Validate stock for each item and prepare farmer-grouped items
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map();
    dbProducts.forEach((p) => {
      productMap.set(p._id.toString(), p);
    });

    // Check inventory availability
    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product "${item.name}" is no longer available.` }, { status: 400 });
      }
      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stockQuantity} ${dbProduct.unit}, Requested: ${item.quantity} ${dbProduct.unit}.`,
          },
          { status: 400 }
        );
      }
    }

    // Step 2: Atomic stock decrement for each product
    for (const item of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, stockQuantity: { $gte: item.quantity } },
        {
          $inc: { stockQuantity: -item.quantity },
        },
        { new: true }
      );

      if (!updatedProduct) {
        return NextResponse.json(
          { error: `Stock changed for "${item.name}" while checking out. Please try again.` },
          { status: 409 }
        );
      }

      // Auto update availability if stock hits 0
      if (updatedProduct.stockQuantity === 0) {
        updatedProduct.isAvailable = false;
        await updatedProduct.save();
      }
    }

    // Step 3: Group items by farmerId for multi-farmer order handling
    const farmerGrouped = new Map<string, any[]>();
    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      const farmerIdStr = dbProduct.farmerId.toString();
      
      if (!farmerGrouped.has(farmerIdStr)) {
        farmerGrouped.set(farmerIdStr, []);
      }

      farmerGrouped.get(farmerIdStr)!.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        unitPrice: dbProduct.pricePerUnit,
        quantity: item.quantity,
        unit: dbProduct.unit,
        subtotal: dbProduct.pricePerUnit * item.quantity,
        image: dbProduct.images?.[0] || '',
      });
    }

    const createdOrders = [];
    const timestamp = Date.now().toString().slice(-6);
    let orderIndex = 1;

    for (const [farmerIdStr, farmerItems] of farmerGrouped.entries()) {
      const subtotal = farmerItems.reduce((sum, it) => sum + it.subtotal, 0);
      const orderNumber = `KM-${timestamp}-${orderIndex++}`;

      const order = await Order.create({
        orderNumber,
        consumerId: auth.userId,
        farmerId: farmerIdStr,
        items: farmerItems,
        totalAmount: subtotal,
        deliverySlot: {
          date: new Date(deliverySlot.date),
          timeSlot: deliverySlot.timeSlot,
        },
        shippingAddress,
        status: 'pending',
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      });

      createdOrders.push(order);
    }

    return NextResponse.json(
      {
        message: 'Order(s) placed successfully.',
        orderCount: createdOrders.length,
        orders: createdOrders,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
