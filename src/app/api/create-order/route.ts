import { backendClient } from '@/sanity/lib/backendClient';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('[ORDER BODY]', body); // 👈 Add this

    const {
      customerName,
      phone,
      email,
      productId,
      customizations,
      totalPrice,
    } = body;

    const order = {
      _type: 'order',
      orderNumber: uuidv4(),
      customerName,
      phone,
      email,
      totalPrice,
      tax: 0,
      currency: 'usd',
      amountDiscount: 0,
      orderType: 'reservation',
      paymentStatus: 'unpaid',
      pickupStatus: 'pending',
      orderDate: new Date().toISOString(),
      paymentMethod: 'online_unpaid',
      products: [
        {
          _key: uuidv4(),
          product: { _type: 'reference', _ref: productId },
          price: totalPrice,
          quantity: 1,
          customizations,
        },
      ],
    };

    const created = await backendClient.create(order);

    console.log('[ORDER CREATED]', created); // 👈 Add this

    return NextResponse.json({ success: true, orderId: created._id });
  } catch (err: any) {
    console.error('❌ Create Order Error:', err);

    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}
