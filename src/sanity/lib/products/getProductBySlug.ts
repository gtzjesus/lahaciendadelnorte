// /sanity/lib/products/getProductBySlug.ts
import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Product } from '@/types';

export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
    *[_type == 'product' && slug.current == $slug][0]{
      _id,
      itemNumber,
      name,
      slug,
      price,
      stock,
      "imageUrl": image.asset->url,
      "extraImageUrls": extraImages[].asset->url,
      category->{_id, title},
      variants[]{
        size,
        price,
        stock
      }
    }
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });

    const product = result.data as Product;
    return product ?? null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};
