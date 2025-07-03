import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type OrderItem = {
  productId: string; // Must be in format "productId-size"
  quantity: number;
  price: number;
};

function generateOrderCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: OrderItem[] = body.items;

    const paymentMethod = body.paymentMethod as 'cash' | 'card' | 'split';
    const cashReceived =
      typeof body.cashReceived === 'number' ? body.cashReceived : 0;
    const cardAmount =
      typeof body.cardAmount === 'number' ? body.cardAmount : 0;
    const changeGiven =
      typeof body.changeGiven === 'number' ? body.changeGiven : 0;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items provided' },
        { status: 400 }
      );
    }

    // ✅ Validate item format
    for (const item of items) {
      if (
        typeof item.productId !== 'string' ||
        typeof item.quantity !== 'number' ||
        typeof item.price !== 'number'
      ) {
        return NextResponse.json(
          { success: false, message: 'Invalid item format' },
          { status: 400 }
        );
      }

      const [productId, variantSize] = item.productId.split('-');
      if (!productId || !variantSize) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid productId format: "${item.productId}" (expected format: "productId-size")`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = +(subtotal * 0.0825).toFixed(2);
    const totalPrice = subtotal + tax;

    const orderNumber = generateOrderCode();
    const clerkUserId = 'store-user-123'; // Replace later with real user
    const customerName = 'Walk-in Customer';
    const email = 'walkin@example.com';

    // 🔄 Decrease variant stock
    for (const item of items) {
      const [productId, variantSize] = item.productId.split('-');
      await decreaseProductStock(productId, variantSize, item.quantity);
    }

    // ✅ Format products for order doc
    const productsForSanity = items.map((item) => {
      const [productId] = item.productId.split('-');
      return {
        _key: crypto.randomUUID(),
        _type: 'object',
        product: { _type: 'reference', _ref: productId },
        quantity: item.quantity,
        price: item.price,
      };
    });

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
      pickupStatus: 'picked_up',
      orderDate: new Date().toISOString(),
      tax,
      paymentMethod,
      cashReceived,
      cardAmount,
      changeGiven,
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
  } catch (err: any) {
    console.error('❌ Error creating order:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Unknown server error' },
      { status: 500 }
    );
  }
}
