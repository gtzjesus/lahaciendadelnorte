// /app/api/get-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) {
    return NextResponse.json(
      { success: false, message: 'Missing orderNumber' },
      { status: 400 }
    );
  }

  try {
    const query = groq`
      *[_type == "order" && orderNumber == $orderNumber][0]{
        _id,
        orderNumber,
        clerkUserId,
        customerName,
        email,
        products[] {
          quantity,
          _key,
          product->{
            _id,
            name,
            slug,
            image,
            price,
            itemNumber,
            stock
          }
        },
        totalPrice,
        tax,
        currency,
        amountDiscount,
        orderType,
        paymentStatus,
        pickupStatus,
        orderDate,
        paymentMethod,
        cashReceived,
        cardAmount,
        changeGiven
      }
    `;

    const order = await client.fetch(query, { orderNumber });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('❌ Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
