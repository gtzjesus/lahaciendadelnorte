import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Product } from '@/types';

export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
    *[_type == 'product' && slug.current == $slug][0]
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });

    const product = result.data as Product; // 👈 aquí tipamos solo result.data

    return product ?? null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};
