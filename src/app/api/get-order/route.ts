// /app/api/get-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Missing orderNumber' },
        { status: 400 }
      );
    }

    const query = groq`
      *[_type == "order" && orderNumber == $orderNumber][0]{
        _id,
        orderNumber,
        clerkUserId,
        customerName,
        email,
        products[] {
          _key,
          quantity,
          itemNumber,
          price,
          variant,
          product->{
            _id,
            name,
            slug,
            image,
            itemNumber,
            stock,
            category->{
              title
            },
            variants[] {
              _key,
              name,
              price,
              stock
            }
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
      { success: false, message: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
