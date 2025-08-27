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
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      itemNumber,
      name,
      slug,
      "imageUrl": image.asset->url,
      "extraImageUrls": extraImages[].asset->url,
      category->{_id, title},
      variants[]{
        dimensions,
        material,
        roof,
        price,
        stock,
        windows,
        doors,
        garage,
        addons
      }
    }
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });

    return result.data as Product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};
