// ✅ File: src/app/api/pos/route.ts

import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient'; // ✅ has token

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: OrderItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items provided' },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        typeof item.productId !== 'string' ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1 ||
        typeof item.price !== 'number' ||
        item.price < 0
      ) {
        return NextResponse.json(
          { success: false, message: 'Invalid item format' },
          { status: 400 }
        );
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.0825;
    const totalPrice = subtotal + tax;

    const orderNumber =
      'ORD-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);

    const clerkUserId = 'clerk-placeholder'; // Replace with real user if needed
    const customerName = 'Walk-in Customer';
    const email = 'customer@example.com';

    const productsForSanity = items.map((item) => ({
      _type: 'object',
      product: {
        _type: 'reference',
        _ref: item.productId,
      },
      quantity: item.quantity,
    }));

    const orderDoc = {
      _type: 'order',
      orderNumber,
      clerkUserId,
      customerName,
      email,
      products: productsForSanity,
      totalPrice,
      currency: 'usd',
      amountDiscount: 0,
      orderType: 'reservation',
      paymentStatus: 'paid_in_store',
      pickupStatus: 'not_picked_up',
      orderDate: new Date().toISOString(),
    };

    const createdOrder = await backendClient.create(orderDoc);

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder._id,
        orderNumber: createdOrder.orderNumber,
      },
      { status: 201 }
    );
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
