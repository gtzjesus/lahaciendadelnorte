// /app/api/categories/route.ts

import { NextResponse } from 'next/server';
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // replace this
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-06-26',
});

export async function GET() {
  try {
    const categories = await client.fetch(
      `*[_type == "category"]{_id, title, slug}`
    );
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}
