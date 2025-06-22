import { NextResponse } from 'next/server';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock'; // adjust path if needed
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as {
      items: { productId: string; quantity: number }[];
    };

    // Validate stock availability for all items first
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
            message: `Product ${item.productId} is out of stock or insufficient quantity`,
          }),
          { status: 400 }
        );
      }
    }

    // All good, proceed to decrement stock atomically
    for (const item of items) {
      await decreaseProductStock(item.productId, item.quantity);
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
