// sanity/lib/products/getAllProducts.ts

import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types';

const query = groq`
  *[_type == "product"]{
    _id,
    _createdAt,
    _updatedAt,
    _rev,
    _type,
    name,
    slug,
    description,
    "imageUrl": image.asset->url,
    "extraImageUrls": extraImages[].asset->url,
    image,
    extraImages,
    category->{
      _id,
      title,
      slug,
      description,
      image
    },
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
`;

export async function getAllProducts(): Promise<Product[]> {
  const products = await client.fetch(query);
  return products;
}
