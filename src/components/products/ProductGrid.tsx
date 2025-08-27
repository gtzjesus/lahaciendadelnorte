'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = products.find((p) => p._id === selectedId);

  const handleSelect = (productId: string) => {
    setSelectedId(productId);
  };

  const closeModal = () => {
    setSelectedId(null);
  };

  return (
    <main className="flex flex-col  min-h-screen mx-auto max-w-4xl">
      <div className="max-w-4xl  w-full z-10 flex flex-col mt-20">
        <div className="grid grid-cols-2 ">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSelect(product._id)}
              className="cursor-pointer flex flex-col border border-flag-red border-opacity-25 text-white transition px-4 py-4 hover:shadow-md hover:border-opacity-50"
            >
              <div className="flex flex-col items-center">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal with Slide-In Animation */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-flag-red bg-opacity-90 backdrop-blur-md z-50 text-flag-blue overflow-y-auto"
          >
            <div className="relative max-w-2xl mx-auto px-4 py-6 mt-20 flex flex-col items-center">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-1 z-50 text-white  text-sm uppercase  transition underline"
              >
                close
              </button>

              {/* Main Product Image */}
              {selectedProduct.imageUrl && (
                <div className="w-64 h-64 relative mb-2 overflow-hidden">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Extra Images Gallery */}
              {selectedProduct.extraImageUrls &&
                selectedProduct.extraImageUrls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto mt-4">
                    {selectedProduct.extraImageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 relative flex-shrink-0 rounded-sm overflow-hidden border border-gray-700"
                      >
                        <Image
                          src={url}
                          alt={`${selectedProduct.name} extra image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              {/* Product Info */}
              <div className="text-center">
                <h2 className="text-xl font-bold uppercase">
                  {selectedProduct.name}
                </h2>
                {selectedProduct.category?.title && (
                  <p className="text-sm uppercase  mb-2">
                    {selectedProduct.category.title}
                  </p>
                )}
                {selectedProduct.description && (
                  <p className="text-sm ">{selectedProduct.description}</p>
                )}
              </div>

              {/* Variants */}
              {(selectedProduct.variants ?? []).length > 0 && (
                <div className="w-full mt-4">
                  <p className="text-[10px] text-center uppercase font-light tracking-wider  mb-4">
                    Additional Information
                  </p>

                  <ul className="space-y-4">
                    {selectedProduct.variants?.map((v, i) => (
                      <li
                        key={i}
                        className="border border-gray-700 p-4 rounded-lg text-sm flex flex-col gap-1 text-center"
                      >
                        <p>📐 Dimensions: {v.dimensions}</p>
                        <p>🪵 Material: {v.material}</p>
                        <p>🏠 Roof: {v.roof}</p>
                        <p>🚪 Doors: {v.doors ?? 1}</p>
                        <p>🪟 Windows: {v.windows ?? 0}</p>
                        <p>
                          🚗 Garage: {v.garage ? 'Included' : 'Not included'}
                        </p>
                        {Array.isArray(v.addons) &&
                          v.addons.filter(Boolean).length > 0 && (
                            <p>
                              ➕ Add-ons: {v.addons.filter(Boolean).join(', ')}
                            </p>
                          )}
                        <p>💰 ${v.price?.toFixed(2) ?? '0.00'}</p>
                        <p>📦 {v.stock ?? 0} in stock</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center">
              <button
                className="bg-flag-light-blue text-white font-semibold px-6 py-3 rounded-full shadow-lg text-sm uppercase  transition"
                onClick={() =>
                  alert(`Quote request submitted for ${selectedProduct.name}`)
                }
              >
                Get a Quote for {selectedProduct.name}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
