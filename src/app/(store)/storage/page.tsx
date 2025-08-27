// app/(store)/storage/page.tsx

import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';

export default async function StorageInventoryPage() {
  const products = await getAllProducts();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <ProductGrid products={products} />
    </div>
  );
}
