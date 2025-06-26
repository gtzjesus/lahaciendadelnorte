import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function GET() {
  const products = await backendClient.fetch(`
    *[_type == "product"]{
      _id,
      itemNumber,
      name,
      price,
      stock,
      image{
        asset->{
          _id,
          url
        }
      },
      extraImages[]{
        asset->{
          _id,
          url
        }
      }
    } | order(_createdAt desc)
  `);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const productsWithImageUrls = products.map((product: any) => ({
    ...product,
    imageUrl: product.image?.asset?.url || '',
    extraImageUrls: (product.extraImages || []).map(
      (img: any) => img.asset?.url || ''
    ),
  }));

  return NextResponse.json({ products: productsWithImageUrls });
}
