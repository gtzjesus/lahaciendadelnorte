// /app/api/admin/delete-product/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing productId in request body' },
        { status: 400 }
      );
    }

    // Step 1: Find all orders that reference this product
    const referencingOrders = await backendClient.fetch(
      `*[_type == "order" && references($productId)]{_id, products}`,
      { productId }
    );

    // Step 2: Clean each order's products array
    for (const order of referencingOrders) {
      const updatedProducts = order.products.map((item: any) => {
        if (item.product?._ref === productId) {
          return {
            ...item,
            product: null, // 🧼 nullify reference
          };
        }
        return item;
      });

      await backendClient
        .patch(order._id)
        .set({ products: updatedProducts })
        .commit();
    }

    // Step 3: Now safely delete the product
    await backendClient.delete(productId);

    return NextResponse.json({ message: 'Item deleted' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
