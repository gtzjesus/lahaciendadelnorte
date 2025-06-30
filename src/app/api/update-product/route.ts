import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function PATCH(req: NextRequest) {
  try {
    const { productId, name, price, stock, categoryIds } = await req.json();

    if (
      !productId ||
      typeof name !== 'string' ||
      typeof price !== 'number' ||
      typeof stock !== 'number' ||
      !Array.isArray(categoryIds)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const categoriesRefs = categoryIds.map((id: string) => ({
      _type: 'reference',
      _ref: id,
    }));

    await backendClient
      .patch(productId)
      .set({
        name,
        price,
        stock,
        categories: categoriesRefs,
      })
      .commit();

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
