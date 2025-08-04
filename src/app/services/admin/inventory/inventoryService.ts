// services/admin/inventory.ts

import type {
  AdminCategory,
  AdminProduct,
  Variant,
} from '@/types/admin/inventory';

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const res = await fetch('/api/products');
  const json = await res.json();
  return Array.isArray(json.products) ? json.products : json;
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await fetch('/api/categories');
  const json = await res.json();
  return json.categories || [];
}

export async function uploadAdminProduct(data: {
  itemNumber: string;
  name: string;
  slug: string;
  category: string;
  variants: Variant[];
  mainImage: File;
  extraImages: File[];
}): Promise<AdminProduct> {
  const formData = new FormData();
  formData.append('itemNumber', data.itemNumber);
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  formData.append('category', data.category);
  formData.append('variants', JSON.stringify(data.variants));
  formData.append('mainImage', data.mainImage);
  data.extraImages.forEach((file) => formData.append('extraImages', file));

  const res = await fetch('/api/products', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
