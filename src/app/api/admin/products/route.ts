import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import type { SanityAssetDocument } from '@sanity/client';

/* eslint-disable  @typescript-eslint/no-explicit-any */

// Helper: upload image file to Sanity and return the asset reference
async function uploadImageToSanity(file: File): Promise<SanityAssetDocument> {
  // Sanity client expects a ReadableStream, File has stream() in modern browsers
  // But since Next.js server might have Buffer, we can read it as Blob

  // Convert File to blob buffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const asset = await backendClient.assets.upload('image', buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return asset;
}

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Get fields
    const itemNumber = formData.get('itemNumber');
    const name = formData.get('name');
    const slug = formData.get('slug');
    const category = formData.get('category');
    const variantsStr = formData.get('variants');
    const mainImage = formData.get('mainImage');
    const extraImages = formData.getAll('extraImages');

    // Validate required fields
    if (
      typeof itemNumber !== 'string' ||
      typeof name !== 'string' ||
      typeof slug !== 'string' ||
      typeof category !== 'string' ||
      typeof variantsStr !== 'string' ||
      !(mainImage instanceof File)
    ) {
      return NextResponse.json(
        { message: 'Invalid form data' },
        { status: 400 }
      );
    }

    const variants = JSON.parse(variantsStr);

    // Upload main image to Sanity
    const mainImageAsset = await uploadImageToSanity(mainImage);

    // Upload extra images to Sanity
    const extraImageAssets = [];
    for (const img of extraImages) {
      if (img instanceof File) {
        const asset = await uploadImageToSanity(img);
        extraImageAssets.push({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        });
      }
    }

    // Build the product object
    const newProduct = {
      _type: 'product',
      itemNumber,
      name,
      slug: {
        _type: 'slug',
        current: slug,
      },
      category: {
        _type: 'reference',
        _ref: category,
      },
      variants,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mainImageAsset._id,
        },
      },
      extraImages: extraImageAssets,
    };

    // Save product to Sanity
    const savedProduct = await backendClient.create(newProduct);

    return NextResponse.json(savedProduct);
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
