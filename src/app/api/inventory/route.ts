import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const itemNumber = formData.get('itemNumber')?.toString();
    const name = formData.get('name')?.toString();
    const slug = formData.get('slug')?.toString();
    const stock = parseInt(formData.get('stock') as string);
    const categoryId = formData.get('categoryId')?.toString();

    if (!itemNumber || !name || !slug || isNaN(stock)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sizesRaw = formData.get('sizes')?.toString();
    const flavorsRaw = formData.get('flavors')?.toString();

    let sizes: { label: string; price: number }[] = [];
    let flavors: string[] = [];
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    try {
      if (sizesRaw) {
        const parsed = JSON.parse(sizesRaw);
        sizes = parsed.map((s: any) => ({
          label: s.label,
          price: parseFloat(s.price),
        }));
      }

      if (flavorsRaw) {
        flavors = JSON.parse(flavorsRaw);
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: `Invalid sizes/flavors ${err}` },
        { status: 400 }
      );
    }

    const mainImage = formData.get('mainImage') as File | null;
    let mainImageRef = null;

    if (mainImage && mainImage.size > 0) {
      const uploaded = await backendClient.assets.upload('image', mainImage);
      mainImageRef = {
        _type: 'image',
        asset: { _type: 'reference', _ref: uploaded._id },
      };
    }

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

    const newProduct: any = {
      _type: 'product',
      itemNumber,
      name,
      slug: { _type: 'slug', current: slug },
      stock,
      image: mainImageRef,
      extraImages: extraImageRefs,
      sizes: sizes.map((s) => ({
        _type: 'sizeOption',
        label: s.label,
        price: s.price,
      })),
      flavors,
    };

    if (categoryId) {
      newProduct.category = {
        _type: 'reference',
        _ref: categoryId,
      };
    }

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
