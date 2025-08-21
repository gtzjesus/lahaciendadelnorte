import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // 1. Fetch referencing orders
    const referencingOrders = await backendClient.fetch(
      `*[_type == "order" && references($productId)]{_id, products}`,
      { productId }
    );
    console.log('Orders referencing product:', referencingOrders);

    // 2. Clean each order
    for (const order of referencingOrders) {
      const updatedProducts = order.products.map((item: any) =>
        item.product?._ref === productId ? { ...item, product: null } : item
      );

      await backendClient
        .patch(order._id)
        .set({ products: updatedProducts })
        .commit();
      console.log(`Cleaned reference in order ${order._id}`);
    }

    // 3. Attempt deletion
    await backendClient.delete(productId);
    console.log(`Deleted product ${productId}`);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error during delete operation:', error);
    return NextResponse.json(
      { error: error.message || 'Could not delete product' },
      { status: 500 }
    );
  }
}
