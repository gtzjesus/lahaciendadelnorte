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
  itemNumber: string;
  name: string;
  slug: SanitySlug;
  price: number;
  stock?: number;

  image?: SanityImage;
  imageUrl?: string; // ✅ manually resolved from GROQ query
  extraImages?: SanityImage[];
  extraImageUrls?: string[]; // ✅ manually resolved from GROQ query

  description?: string;

  variants?: {
    size?: string;
    dimensions?: string;
    material?: string;
    roof?: string;
    price?: number;
    stock?: number;
    windows?: number;
    doors?: number;
    garage?: boolean;
    addons?: string[];
  }[];

  category?: Category;
  categories?: Category[]; // optional if you use both singular/plural
  flavors?: string[]; // if unused, you can remove
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
