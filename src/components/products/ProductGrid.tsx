'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProductModal from './ProductModal'; // <-- import here

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = products.find((p) => p._id === selectedId);

  return (
    <main className="flex flex-col min-h-screen mx-auto max-w-4xl">
      <div className="max-w-4xl w-full z-10 flex flex-col mt-20">
        <div className="grid grid-cols-2">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => setSelectedId(product._id)}
              className="cursor-pointer flex flex-col border border-white border-opacity-25 text-white transition px-2 py-4"
            >
              <div className="flex flex-col items-center">
                {product.imageUrl && (
                  <div className="w-40 h-40 relative mb-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-sm p-4"
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold uppercase text-sm">
                    {product.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
