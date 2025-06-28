import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

type OrderItem = {
  productId: string;
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

    // ✅ new payment fields
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
    const orderNumber = generateOrderCode();

    const clerkUserId = 'clerk-placeholder';
    const customerName = 'Walk-in Customer';
    const email = 'customer@example.com';

    const productsForSanity = items.map((item) => ({
      _key: crypto.randomUUID(),
      _type: 'object',
      product: { _type: 'reference', _ref: item.productId },
      quantity: item.quantity,
      price: item.price,
      finalPrice: item.price * item.quantity,
    }));

    for (const item of items) {
      const product = await backendClient.fetch(
        `*[_type == "product" && _id == $id][0]{stock}`,
        { id: item.productId }
      );
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }
      const currentStock = product.stock ?? 0;
      const newStock = currentStock - item.quantity;
      if (newStock < 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for product ${item.productId}`,
          },
          { status: 400 }
        );
      }
      await backendClient
        .patch(item.productId)
        .set({ stock: newStock })
        .commit();
    }

    const orderDoc = {
      _type: 'order',
      orderNumber,
      clerkUserId,
      customerName,
      email,
      products: productsForSanity, // los productos llevan itemNumber
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
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
