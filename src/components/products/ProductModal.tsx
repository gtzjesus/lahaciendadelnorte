'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 bg-flag-red bg-opacity-90 backdrop-blur-md z-50 text-white overflow-y-auto"
    >
      <div className="relative max-w-2xl mx-auto mt-5 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 z-50 text-white text-sm uppercase transition underline"
        >
          close
        </button>

        {/* Main Product Image */}
        <h2 className="text-xl font-bold uppercase mt-10">{product.name}</h2>
        {product.imageUrl && (
          <div className="w-64 h-64 relative mb-2 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Extra Images Gallery */}
        {product.extraImageUrls && product.extraImageUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-4">
            {product.extraImageUrls.map((url, index) => (
              <div
                key={index}
                className="w-20 h-20 relative flex-shrink-0 rounded-sm overflow-hidden border border-gray-700"
              >
                <Image
                  src={url}
                  alt={`${product.name} extra image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="text-center">
          {product.category?.title && (
            <p className="text-sm uppercase mb-2">{product.category.title}</p>
          )}
          {product.description && (
            <p className="text-sm ">{product.description}</p>
          )}
        </div>

        {/* Variants */}
        {(product.variants ?? []).length > 0 && (
          <div className="w-full mt-4">
            <p className="text-[10px] text-center uppercase font-light tracking-wider mb-4">
              Additional Information
            </p>

            <ul className="space-y-4">
              {product.variants?.map((v, i) => (
                <li
                  key={i}
                  className="border border-gray-700 p-4 rounded-lg text-sm flex flex-col gap-1 text-center"
                >
                  <p>📐 Dimensions: {v.dimensions}</p>
                  <p>🪵 Material: {v.material}</p>
                  <p>🏠 Roof: {v.roof}</p>
                  <p>🚪 Doors: {v.doors ?? 1}</p>
                  <p>🪟 Windows: {v.windows ?? 0}</p>
                  <p>🚗 Garage: {v.garage ? 'Included' : 'Not included'}</p>
                  {Array.isArray(v.addons) &&
                    v.addons.filter(Boolean).length > 0 && (
                      <p>➕ Add-ons: {v.addons.filter(Boolean).join(', ')}</p>
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
          className="bg-flag-light-blue text-white font-semibold px-6 py-3 rounded-full shadow-lg text-sm uppercase transition"
          onClick={() => alert(`Quote request submitted for ${product.name}`)}
        >
          Get a Quote for {product.name}
        </button>
      </div>
    </motion.div>
  );
}
