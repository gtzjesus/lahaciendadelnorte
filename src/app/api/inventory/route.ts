// app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const itemNumber = formData.get('itemNumber')?.toString();
    const name = formData.get('name')?.toString();
    const slug = formData.get('slug')?.toString();
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);

    if (!itemNumber || !name || !slug || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    const existing = await backendClient.fetch(
      `*[_type == "product" && itemNumber == $itemNumber][0]`,
      { itemNumber }
    );
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Item number already exists' },
        { status: 400 }
      );
    }

    let mainImageRef = null;
    const mainImage = formData.get('mainImage') as File | null;
    if (mainImage && mainImage.size > 0) {
      const uploaded = await backendClient.assets.upload('image', mainImage, {
        filename: mainImage.name,
      });
      mainImageRef = {
        _type: 'image',
        asset: { _type: 'reference', _ref: uploaded._id },
      };
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const extraImageRefs: any[] = [];
    const extraImages = formData.getAll('extraImages') as File[];
    for (const img of extraImages) {
      if (img && img.size > 0) {
        const uploaded = await backendClient.assets.upload('image', img, {
          filename: img.name,
        });
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
      price,
      stock,
      image: mainImageRef,
      extraImages: extraImageRefs,
    };

    await backendClient.create(newProduct);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error('Inventory API error', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
