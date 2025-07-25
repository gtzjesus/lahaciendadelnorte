// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/products/ProductsView';
import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/sanity/lib/products/getCategoryBySlug';

/**
 * CategoryPage Component
 * Displays products for a specific category based on the 'slug' in the URL.
 * If no products are found, a 404 page is shown.
 *
 * @param {Object} params - The category slug from the URL
 * @returns {JSX.Element} The rendered page showing the category's products.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await params before destructuring
  const { slug } = await params;

  // Fetch category data by slug
  const category = await getCategoryBySlug(slug);

  const categoryTitle =
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'La Dueña';

  const title = category?.title || categoryTitle;
  const description =
    category?.description ||
    'Delicious shaved ice, ice cream, and snacks from La Dueña in Canutillo, TX.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://laduena.store/categories/${slug}`,
      siteName: 'La Dueña',
      type: 'website',
    },
    alternates: {
      canonical: `https://laduena.store/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const categories = await getAllCategories();

  if (!products || products.length === 0) return notFound();

  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <>
      <div className="w-full bg-flag-red">
        <Header />
        <h1 className="uppercase text-sm font-light text-center p-5 text-white">
          {formattedTitle}
        </h1>
      </div>

      <div className="container mx-auto px-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </>
  );
}
