import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { v4 as uuidv4 } from 'uuid';

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

    // Fetch latest _rev and stock for all products in the sale
    const productIds = items.map((item) => item.productId);
    const latestProducts = await backendClient.fetch<
      { _id: string; _rev: string; stock: number }[]
    >(`*[_type == "product" && _id in $ids]{_id, _rev, stock}`, {
      ids: productIds,
    });

    // Validate stock availability before commit
    for (const item of items) {
      const product = latestProducts.find((p) => p._id === item.productId);
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
            message: `Insufficient stock for product ${item.productId}`,
          }),
          { status: 400 }
        );
      }
    }

    const orderId = `order-${uuidv4()}`;
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Build the order document
    const orderDoc = {
      _id: orderId,
      _type: 'order',
      orderNumber: `POS-${uuidv4()}`,
      orderDate: new Date().toISOString(),
      clerkUserId: 'demo-user', // replace or extend as needed
      customerName: 'Walk-In',
      email: 'noemail@store.com',
      totalPrice,
      currency: 'usd',
      amountDiscount: 0,
      orderType: 'sale',
      paymentStatus: 'paid_in_store',
      pickupStatus: 'picked_up',
      products: items.map((item) => ({
        _key: uuidv4(),
        _type: 'orderItem', // or 'object', whatever your schema expects
        product: { _type: 'reference', _ref: item.productId },
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Start transaction
    const txn = backendClient.transaction();

    // Create order document
    txn.create(orderDoc);

    // Patch products to decrement stock with revision check
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    for (const item of items) {
      const product = latestProducts.find((p) => p._id === item.productId);
      if (!product) {
        throw new Error(
          `Product ${item.productId} not found during transaction`
        );
      }
      (txn.patch(product._id) as any)
        .ifRevisionId(product._rev)
        .dec({ stock: item.quantity });
    }

    // Commit transaction
    await txn.commit();

    return NextResponse.json({
      success: true,
      message: 'Stock adjusted and order created',
      orderId,
    });
  } catch (error) {
    console.error('❌ POS API error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: (error as Error).message }),
      { status: 500 }
    );
  }
}
