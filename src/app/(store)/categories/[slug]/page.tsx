import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import ProductGrid from '@/components/products/ProductGrid';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  if (!products || products.length === 0) return notFound();

  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <>
      <h1 className="uppercase text-sm font-light text-center p-5 text-white">
        {formattedTitle}
      </h1>

      <div className="relative w-full min-h-screen overflow-hidden">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
