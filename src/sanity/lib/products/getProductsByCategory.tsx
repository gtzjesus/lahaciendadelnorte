// getProductsByCategory.ts

import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Product } from '@/types';

export const getProductsByCategory = async (
  categorySlug: string
): Promise<Product[]> => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == 'product' && references(*[_type == 'category' && slug.current == $categorySlug]._id)] | order(name asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      description,
      
      // Main and extra images
      image,
      "imageUrl": image.asset->url,
      extraImages,
      "extraImageUrls": extraImages[].asset->url,

      // Fully resolved category
      category->{
        _id,
        title,
        slug,
        description,
        image
      },

      // Match the same structure as getAllProducts.ts
      baseVariants[] {
        dimensions,
        basePrice
      },
      materials[] {
        name,
        price
      },
      roofTypes[] {
        name,
        price
      },
      addons[] {
        name,
        price
      },
      garagePrice,
      doorPrice,
      windowPrice
    }
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error('Error fetching products by category', error);
    return [];
  }
};
