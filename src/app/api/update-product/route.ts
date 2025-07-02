import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const runtime = 'nodejs';

type Variant = {
  size: string;
  price: number;
  stock: number;
};

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

    // Parse sizes/variants if provided
    let sizes: Variant[] | undefined = undefined;
    if (sizesRaw) {
      try {
        sizes = JSON.parse(sizesRaw);
      } catch (err) {
        return NextResponse.json(
          { error: `Invalid sizes JSON: ${err}` },
          { status: 400 }
        );
      }
    }

    if (sizes) {
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
          { error: 'Invalid size data' },
          { status: 400 }
        );
      }
    }

    // Parse flavors if provided
    let flavors: string[] | undefined = undefined;
    if (flavorsRaw) {
      try {
        flavors = JSON.parse(flavorsRaw);
      } catch (err) {
        return NextResponse.json(
          { error: `Invalid flavors JSON: ${err}` },
          { status: 400 }
        );
      }
    }

    // Upload main image (optional)
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

    // Upload extra images (optional)
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

    // Build patch
    const patch = backendClient.patch(productId);

    // Conditionally set fields only if they exist and are valid

    if (name && name.trim() !== '') {
      patch.set({ name });
    }

    if (categoryId && categoryId.trim() !== '') {
      patch.set({
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
      });
    }

    if (typeof flavors !== 'undefined') {
      patch.set({ flavors });
    }

    if (sizes) {
      patch.set({
        variants: sizes.map((v) => ({
          _type: 'variant',
          size: v.size,
          price: v.price,
          stock: v.stock,
        })),
      });
    }

    if (mainImageRef) {
      patch.set({ image: mainImageRef });
    }

    if (extraImageRefs.length > 0) {
      patch.set({ extraImages: extraImageRefs });
    }

    await patch.commit();

    return NextResponse.json({ message: 'Product updated successfully' });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
