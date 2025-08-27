import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Product } from '@/types';

export const getAllProducts = async (): Promise<Product[]> => {
  const query = defineQuery(`
    *[_type == 'product'] | order(name asc){
      _id,
      name,
      itemNumber,
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
    const result = await sanityFetch({ query });
    return (result.data as Product[]) || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};
