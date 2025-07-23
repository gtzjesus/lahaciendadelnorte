import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET() {
  const query = `
  *[_type == "order"] | order(orderDate desc) {
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

  try {
    const orders = await client.fetch(query);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
