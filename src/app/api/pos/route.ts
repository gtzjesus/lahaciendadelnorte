import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient'; // ✅ has token

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

// Generate random 6-letter uppercase order code
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

    // Update stock for each product
    for (const item of items) {
      // Fetch current stock to ensure no negative stock
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

      // Patch stock
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
      products: productsForSanity,
      totalPrice,
      currency: 'usd',
      amountDiscount: 0,
      orderType: 'reservation',
      paymentStatus: 'paid', // Set payment status to paid
      pickupStatus: 'picked_up', // Set pickup status to picked_up
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
