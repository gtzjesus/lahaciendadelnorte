'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p._id === selectedId);

  const handleSelect = (productId: string) => {
    setSelectedId((prev) => (prev === productId ? null : productId));
  };

  return (
    <main className="flex flex-col  min-h-screen mx-auto max-w-4xl">
      <div className="max-w-4xl fixed w-full z-10 flex flex-col mt-20 ">
        {/* Product Grid */}
        <div className="grid grid-cols-2 ">
          {products.map((product) => {
            const isSelected = selectedId === product._id;

            return (
              <div
                key={product._id}
                onClick={() => handleSelect(product._id)}
                className="flex flex-col border  border-flag-red border-opacity-25   text-white transition px-4 py-4"
              >
                <div className="flex flex-col items-center">
                  <p className="text-xs  text-gray-300 mb-1">
                    {product.itemNumber}
                  </p>

                  {product.imageUrl && (
                    <div className="w-40 h-40 relative mb-3">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                  )}

                  <div className="text-center mb-2">
                    <p className="font-semibold uppercase text-sm">
                      {product.name}
                    </p>
                    {product.category?.title && (
                      <p className="text-xs ">{product.category.title}</p>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                <div
                  className={clsx(
                    'transition-all overflow-hidden duration-500',
                    isSelected ? 'max-h-[1000px] mt-4' : 'max-h-0'
                  )}
                >
                  {product.description && (
                    <p className="text-sm mb-4">{product.description}</p>
                  )}

                  {(product.variants ?? []).length > 0 && (
                    <div className="mt-2 border-t border-flag-red border-opacity-25 pt-2">
                      <p className="text-xs text-center mb-2 uppercase font-light">
                        Additional Information
                      </p>
                      <ul className="text-sm space-y-4">
                        {product.variants?.map((v, i) => (
                          <li
                            key={i}
                            className="flex flex-col items-center justify-between text-center gap-1"
                          >
                            <p>Dimensions {v.dimensions}</p>
                            <p>{v.material}</p>
                            <p>{v.roof}</p>
                            <p>{v.garage ? 'Garage Included' : 'No Garage'}</p>
                            <p>${v.price?.toFixed(2) || '0.00'}</p>
                            <p>{v.stock ?? 0} in stock</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom "Get a Quote" CTA */}
        {selectedProduct && (
          <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <button
              className="bg-flag-red  transition text-flag-blue font-semibold px-6 py-3 rounded-full shadow-lg text-sm uppercase"
              onClick={() => alert(`Get quote for: ${selectedProduct.name}`)}
            >
              Submit order for a {selectedProduct.name}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
