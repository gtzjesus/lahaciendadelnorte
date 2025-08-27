// app/(store)/storage/page.tsx

import Background from '@/components/(store)/common/Background';
import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';

export default async function StorageInventoryPage() {
  const products = await getAllProducts();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Custom background image */}
      <Background imageSrc="/(store)/inventory.webp" overlayOpacity={70} />

      {/* Content sits on top of background */}
      <div className="relative z-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
