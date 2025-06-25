import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock';
import { nanoid } from 'nanoid';

type POSItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: POSItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'No items provided' }),
        { status: 400 }
      );
    }

    // Step 1: Validate stock
    for (const item of items) {
      const product = await backendClient.fetch<{ stock: number }>(
        `*[_id == $id][0]{stock}`,
        { id: item.productId }
      );

      if (!product) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Product ${item.productId} not found`,
          }),
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Insufficient stock for ${item.productId}`,
          }),
          { status: 400 }
        );
      }
    }

    // Step 2: Reduce stock
    for (const item of items) {
      await decreaseProductStock(item.productId, item.quantity);
    }

    // Step 3: Create order in Sanity
    const orderId = nanoid(10);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const createdOrder = await backendClient.create({
      _type: 'order',
      orderNumber: `POS-${orderId}`,
      orderDate: new Date().toISOString(),
      clerkUserId: 'demo-user', // adjust accordingly
      customerName: 'Walk-In',
      email: 'noemail@store.com',
      totalPrice,
      currency: 'usd',
      orderType: 'reservation',
      paymentStatus: 'paid_in_store',
      pickupStatus: 'picked_up',
      products: items.map((item) => ({
        _key: item.productId,
        _type: 'object', // MUST be here
        product: {
          _type: 'reference',
          _ref: item.productId,
        },
        quantity: item.quantity,
      })),
    });

    return NextResponse.json({
      success: true,
      message: 'Stock adjusted and order created',
      orderId: createdOrder._id,
    });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('❌ POS API error:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message:
          error?.message ||
          'Unknown server error. Check your backendClient and schema.',
      }),
      { status: 500 }
    );
  }
}
