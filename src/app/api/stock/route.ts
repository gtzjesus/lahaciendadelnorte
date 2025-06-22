import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json({ error: 'Missing product IDs' }, { status: 400 });
  }

  const ids = idsParam.split(',').map((id) => id.trim());

  try {
    const products = await backendClient.fetch<
      { _id: string; stock: number }[]
    >(`*[_type == "product" && _id in $ids]{ _id, stock }`, { ids });

    const stockMap: Record<string, number> = {};
    for (const p of products) {
      stockMap[p._id] = p.stock ?? 0;
    }

    return NextResponse.json(stockMap);
  } catch (err) {
    console.error('❌ Error fetching live stock:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
