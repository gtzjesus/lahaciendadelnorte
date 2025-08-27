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
      itemNumber,
      name,
      slug,
      price,
      stock,
      description,

      // 🖼️ Resolve main image to URL
      image,
      "imageUrl": image.asset->url,

      // 🖼️ Resolve extra images to URLs
      extraImages,
      "extraImageUrls": extraImages[].asset->url,

      // 📦 Variants
      variants[] {
        size,
        dimensions,
        material,
        roof,
        price,
        stock,
        windows,
        doors,
        garage,
        addons
      },

      // 🏷️ Resolved Category
      category->{
        _id,
        title,
        slug,
        description,
        image,
        "imageUrl": image.asset->url
      }
    }
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });

    return (result.data ?? []) as Product[];
  } catch (error) {
    console.error('Error fetching products by category', error);
    return [];
  }
};
