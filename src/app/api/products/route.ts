import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function GET() {
  const products = await backendClient.fetch(`
    *[_type == "product"]{
      _id, itemNumber, name, price, stock
    } | order(_createdAt desc)
  `);
  return NextResponse.json({ products });
}
