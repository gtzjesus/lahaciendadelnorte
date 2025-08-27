'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(
    product.imageUrl ?? null
  );

  const wordLimit = 10;

  // Disable scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const getShortDescription = (desc: string) => {
    const words = desc.split(' ');
    return (
      words.slice(0, wordLimit).join(' ') +
      (words.length > wordLimit ? '...' : '')
    );
  };

  const handleImageClick = (url: string) => {
    setMainImage(url);
  };

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 bg-flag-red bg-opacity-80 backdrop-blur-md z-50 text-white overflow-y-auto"
    >
      <div className="relative max-w-2xl mx-auto mt-5 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 z-50 text-white text-sm uppercase transition underline"
        >
          close
        </button>

        {/* Product Title */}
        <h2 className="text-xl font-bold uppercase">{product.name}</h2>

        {/* Main Image */}
        {mainImage && (
          <div className="w-40 h-40 relative overflow-hidden mt-2 mb-4">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        {/* Thumbnails */}
        {product.extraImageUrls && product.extraImageUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {[product.imageUrl, ...product.extraImageUrls]
              .filter(Boolean)
              .map((url, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 relative flex-shrink-0 border rounded overflow-hidden cursor-pointer ${
                    mainImage === url
                      ? 'border-2 border-white'
                      : 'border-gray-700'
                  }`}
                  onClick={() => handleImageClick(url!)}
                >
                  <Image
                    src={url!}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        )}

        {/* Description & Category */}
        <div className="text-center px-6">
          {product.category?.title && (
            <p className="text-xs uppercase my-2 text-gray-400">
              {product.category.title}
            </p>
          )}

          {product.description && (
            <div className="text-sm">
              <p>
                {showFullDesc
                  ? product.description
                  : getShortDescription(product.description)}
              </p>
              {product.description.split(' ').length > wordLimit && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="  z-50 text-white text-xs  transition underline"
                >
                  {showFullDesc ? 'Show less' : 'Learn more'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Variants */}
        {(product.variants ?? []).length > 0 && (
          <div className="w-full mt-6 px-4">
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
