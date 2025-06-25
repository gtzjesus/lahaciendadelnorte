import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock';

type POSItem = {
  productId: string;
  quantity: number;
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

    // Step 1: Validate stock for each product
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

    // Step 2: All checks passed – reduce stock
    for (const item of items) {
      await decreaseProductStock(item.productId, item.quantity);
    }

    return NextResponse.json({
      success: true,
      message: 'Stock adjusted successfully',
    });
  } catch (error) {
    console.error('❌ POS API error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: (error as Error).message }),
      { status: 500 }
    );
  }
}
