import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const runtime = 'nodejs';

type Variant = {
  size: string;
  price: number;
  stock: number;
};
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();

    const productId = formData.get('productId')?.toString();
    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required field: productId' },
        { status: 400 }
      );
    }

    const name = formData.get('name')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const sizesRaw = formData.get('sizes')?.toString();
    const flavorsRaw = formData.get('flavors')?.toString();

    // ----- Parse sizes (variants) -----
    let sizes: Variant[] | undefined = undefined;
    if (sizesRaw) {
      try {
        const parsed = JSON.parse(sizesRaw);
        if (Array.isArray(parsed)) {
          sizes = parsed.map((v: any) => ({
            size: String(v.label || v.size || '').trim(),
            price: Number(v.price),
            stock: Number(v.stock),
          }));
        }
      } catch (err) {
        return NextResponse.json(
          { error: `Invalid sizes JSON: ${err}` },
          { status: 400 }
        );
      }
    }

    if (sizes && sizes.length > 0) {
      const invalid = sizes.some(
        (v) =>
          !v.size ||
          typeof v.price !== 'number' ||
          isNaN(v.price) ||
          v.price < 0 ||
          typeof v.stock !== 'number' ||
          isNaN(v.stock) ||
          v.stock < 0
      );
      if (invalid) {
        return NextResponse.json(
          { error: 'Invalid variant data: size, price, or stock invalid' },
          { status: 400 }
        );
      }
    }

    // ----- Parse flavors -----
    let flavors: string[] | undefined = undefined;
    if (flavorsRaw) {
      try {
        const parsed = JSON.parse(flavorsRaw);
        if (Array.isArray(parsed)) {
          flavors = parsed.map((f) => String(f).trim());
        }
      } catch (err) {
        return NextResponse.json(
          { error: `Invalid flavors JSON: ${err}` },
          { status: 400 }
        );
      }
    }

    // ----- Upload main image -----
    const mainImage = formData.get('mainImage') as File | null;
    let mainImageRef = null;

    if (mainImage && mainImage.size > 0) {
      const uploaded = await backendClient.assets.upload('image', mainImage);
      if (uploaded?._id) {
        mainImageRef = {
          _type: 'image',
          asset: { _type: 'reference', _ref: uploaded._id },
        };
      }
    }

    // ----- Upload extra images -----
    const extraImageRefs = [];
    const extraImages = formData.getAll('extraImages') as File[];

    for (const img of extraImages) {
      if (img.size > 0) {
        const uploaded = await backendClient.assets.upload('image', img);
        if (uploaded?._id) {
          extraImageRefs.push({
            _type: 'image',
            asset: { _type: 'reference', _ref: uploaded._id },
          });
        }
      }
    }

    // ----- Build patch -----
    let patch = backendClient.patch(productId);

    if (name && name.trim() !== '') {
      patch = patch.set({ name: name.trim() });
    }

    if (categoryId && categoryId.trim() !== '') {
      patch = patch.set({
        category: {
          _type: 'reference',
          _ref: categoryId.trim(),
        },
      });
    }

    if (typeof flavors !== 'undefined') {
      patch = patch.set({ flavors });
    }

    if (sizes && sizes.length > 0) {
      patch = patch.set({
        variants: sizes.map((v) => ({
          _type: 'variant',
          size: v.size,
          price: v.price,
          stock: v.stock,
        })),
      });
    }

    if (mainImageRef) {
      patch = patch.set({ image: mainImageRef });
    }

    if (extraImageRefs.length > 0) {
      patch = patch.set({ extraImages: extraImageRefs });
    }

    await patch.commit();

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
