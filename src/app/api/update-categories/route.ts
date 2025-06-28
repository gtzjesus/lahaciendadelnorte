import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function PATCH(req: NextRequest) {
  try {
    const { productId, categoryIds } = await req.json();

    if (!productId || !Array.isArray(categoryIds)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const categoriesRefs = categoryIds.map((id: string) => ({
      _type: 'reference',
      _ref: id,
    }));

    await backendClient
      .patch(productId)
      .set({ categories: categoriesRefs })
      .commit();

    return NextResponse.json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error('Failed to update categories:', error);
    return NextResponse.json(
      { error: 'Failed to update categories' },
      { status: 500 }
    );
  }
}
