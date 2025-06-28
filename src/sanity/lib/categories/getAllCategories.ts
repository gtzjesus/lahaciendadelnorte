// /sanity/lib/categories/getAllCategories.ts
import { client } from '../client';

export async function getAllCategories() {
  return await client.fetch(`*[_type == "category"]{ _id, title, slug }`);
}
