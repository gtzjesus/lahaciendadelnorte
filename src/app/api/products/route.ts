import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET() {
  try {
    const products = await backendClient.fetch(`
      *[_type == "product"] | order(_createdAt desc){
        _id,
        itemNumber,
        name,
        slug,
        image {
          asset->{
            _id,
            url
          }
        },
        extraImages[] {
          asset->{
            _id,
            url
          }
        },
        category->{
          _id,
          title,
          "slug": slug.current
        },
        variants[]{
          size,
          price,
          stock
        }
      }
    `);

    const productsWithImageUrls = products.map((product: any) => ({
      ...product,
      imageUrl: product.image?.asset?.url || '',
      extraImageUrls: (product.extraImages || []).map(
        (img: any) => img.asset?.url || ''
      ),
    }));

    return NextResponse.json({ products: productsWithImageUrls });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
