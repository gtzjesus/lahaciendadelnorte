import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const runtime = 'nodejs';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const itemNumber = formData.get('itemNumber')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const slug = formData.get('slug')?.toString().trim();
    const categoryId = formData.get('categoryId')?.toString().trim();

    if (!itemNumber || !name || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse variants JSON
    const variantsRaw = formData.get('variants')?.toString();
    let variants: {
      size: string;
      price: number;
      stock: number;
    }[] = [];

    try {
      if (variantsRaw) {
        const parsed = JSON.parse(variantsRaw);
        variants = parsed.map((v: any) => ({
          size: v.size,
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
        }));

        const invalid = variants.some(
          (v) =>
            !v.size ||
            isNaN(v.price) ||
            v.price < 0 ||
            isNaN(v.stock) ||
            v.stock < 0
        );

        if (invalid) {
          return NextResponse.json(
            { success: false, message: 'Invalid variant data.' },
            { status: 400 }
          );
        }
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: `Invalid variants data: ${err}` },
        { status: 400 }
      );
    }

    // Upload main image if any
    const mainImage = formData.get('mainImage') as File | null;
    let mainImageRef = null;

    if (mainImage && mainImage.size > 0) {
      const uploaded = await backendClient.assets.upload('image', mainImage);
      mainImageRef = {
        _type: 'image',
        asset: { _type: 'reference', _ref: uploaded._id },
      };
    }

    // Upload extra images
    const extraImageRefs = [];
    const extraImages = formData.getAll('extraImages') as File[];
    for (const img of extraImages) {
      if (img.size > 0) {
        const uploaded = await backendClient.assets.upload('image', img);
        extraImageRefs.push({
          _type: 'image',
          asset: { _type: 'reference', _ref: uploaded._id },
        });
      }
    }

    // Prepare Sanity variant objects (no flavor)
    const sanityVariants = variants.map((v) => ({
      _type: 'variant',
      size: v.size,
      price: v.price,
      stock: v.stock,
    }));

    const newProduct: any = {
      _type: 'product',
      itemNumber,
      name,
      slug: { _type: 'slug', current: slug },
      image: mainImageRef,
      extraImages: extraImageRefs,
      variants: sanityVariants,
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
    };

    await backendClient.create(newProduct);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error('Inventory API error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
