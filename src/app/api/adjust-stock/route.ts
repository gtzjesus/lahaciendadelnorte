import { NextResponse } from 'next/server';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock'; // updated helper
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as {
      items: { productId: string; variantSize: string; quantity: number }[];
    };

    // Validate stock availability for all items first
    for (const item of items) {
      const product = await backendClient.fetch<{
        variants: { size: string; stock: number }[];
      }>(`*[_id == $id][0]{ variants { size, stock } }`, {
        id: item.productId,
      });

      if (!product) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Product ${item.productId} not found`,
          }),
          { status: 404 }
        );
      }

      // Find the variant by size
      const variant = product.variants.find((v) => v.size === item.variantSize);

      if (!variant) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Variant size ${item.variantSize} not found for product ${item.productId}`,
          }),
          { status: 404 }
        );
      }

      if (variant.stock < item.quantity) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Insufficient stock for product ${item.productId} variant ${item.variantSize}`,
          }),
          { status: 400 }
        );
      }
    }

    // All good, proceed to decrement stock atomically for each variant
    for (const item of items) {
      await decreaseProductStock(
        item.productId,
        item.variantSize,
        item.quantity
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API error adjusting stock:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: (error as Error).message }),
      { status: 500 }
    );
  }
}
