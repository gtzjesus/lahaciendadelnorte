// types/index.d.ts

// 🧱 Base Sanity Document
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// 🖼️ Sanity Image
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
}

// 🔗 Sanity Slug
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// 🏷️ Category
export interface Category extends SanityDocument {
  title: string;
  slug: SanitySlug;
  description: string;
  image?: SanityImage;
}

// 🛍️ Product
export interface Product extends SanityDocument {
  name: string;
  slug: SanitySlug;
  price: number;
  stock?: number;
  image?: SanityImage;
  description?: string;
  extraImages?: SanityImage[];

  // 🆕 New fields for shaved ice/snacks
  sizes?: {
    label: string; // e.g. "Small", "Medium", etc.
    price: number;
  }[];

  flavors?: string[]; // e.g. ["Mango", "Guava", "Tamarindo"]
  categories?: Category[]; // in case you're querying expanded category data
}

// 🧠 Basket Item
export interface BasketItem {
  product: Product;
  quantity: number;
}

// 🔎 Search Suggestions
export interface SearchSuggestionsResponse {
  suggestions: Product[];
}

// 🔎 Search Page
export interface SearchPageProps {
  searchParams: { q: string };
}

// 🔍 Query Params
export interface SanityQueryParams {
  [key: string]: string | number | boolean | string[];
}

export interface ProductSearchParams extends SanityQueryParams {
  query: string;
}

export interface DefaultSuggestionsParams extends SanityQueryParams {
  default: boolean;
}

// 💳 Stripe Checkout Metadata
export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

// 🧺 Grouped Basket Item (shared between reservation + checkout)
export interface GroupedBasketItem {
  product: BasketItem['product'];
  quantity: number;
}
