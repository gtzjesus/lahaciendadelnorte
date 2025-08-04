// types/admin/inventory.ts

import type { SanitySlug } from '@/types/index';

export interface Variant {
  size: string;
  price: string;
  stock: string;
}

export interface AdminCategory {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface AdminProduct {
  _id: string;
  itemNumber: string;
  name: string;
  slug: SanitySlug;
  imageUrl?: string;
  extraImageUrls?: string[];
  category?: AdminCategory;
  variants: Variant[];
}
