// /sanity/lib/products/getProductByItemNumber.ts
import { client } from '../client';

export async function getProductByItemNumber(itemNumber: string) {
  return await client.fetch(
    `*[_type == "product" && itemNumber == $itemNumber][0]{
      _id,
      itemNumber,
      name,
      slug,
      price,
      stock,
      "imageUrl": image.asset->url,
      "extraImageUrls": extraImages[].asset->url,
      categories[]->{
        _id,
        title,
        slug
      }
    }`,
    { itemNumber }
  );
}
