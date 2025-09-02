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
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  // Extract unique normalized (lowercase) materials from variants
  const materials = Array.from(
    new Set(
      product.variants
        ?.flatMap((v) =>
          Array.isArray(v.material) ? v.material : [v.material]
        )
        .filter(Boolean)
        .map((m) => m.toLowerCase())
    )
  ) as string[];

  const wordLimit = 3;

  // Find variant matching selectedMaterial (case insensitive)
  const selectedVariant = product.variants?.find((v) => {
    if (Array.isArray(v.material)) {
      return v.material.some(
        (m) => m.toLowerCase() === selectedMaterial?.toLowerCase()
      );
    }
    return v.material?.toLowerCase() === selectedMaterial?.toLowerCase();
  });

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

  const handleMaterialToggle = () => {
    if (!selectedMaterial || materials.length === 0) return;

    // Find current index by comparing lowercase versions
    const currentIndex = materials.findIndex(
      (m) => m.toLowerCase() === selectedMaterial.toLowerCase()
    );
    const nextIndex = (currentIndex + 1) % materials.length;
    console.log(
      `Toggling material from '${selectedMaterial}' to '${materials[nextIndex]}'`
    );
    setSelectedMaterial(materials[nextIndex]);
  };

  // Disable scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Initialize selectedMaterial on mount or when materials update
  useEffect(() => {
    if (materials.length > 0 && selectedMaterial === null) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial]);

  // Capitalize first letter helper
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Debug logs
  console.log('Variants:', product.variants);
  console.log('Extracted materials:', materials);
  console.log('Selected material:', selectedMaterial);

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
        <p className="font-semibold text-md">{capitalize(product.name)}</p>

        {/* Main Image */}
        {mainImage && (
          <div className="w-40 h-40 my-2 relative overflow-hidden">
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
          <div className="flex gap-1 overflow-x-auto">
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

        {/* Product Variants */}
        {materials.length > 0 && selectedVariant && (
          <div className="w-full mt-6 px-4">
            <div className="border border-gray-500 bg-gray-800/30 p-4 text-xs text-white rounded">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="font-light text-gray-500">Dimensions:</span>
                <span className="text-right">{selectedVariant.dimensions}</span>

                <span className="font-light text-gray-500">Material:</span>
                <button
                  onClick={handleMaterialToggle}
                  className="text-right font-medium hover:underline transition"
                >
                  {selectedMaterial
                    ? capitalize(selectedMaterial.trim())
                    : 'Unknown'}
                </button>

                <span className="font-light text-gray-500">Roof:</span>
                <span className="text-right">{selectedVariant.roof}</span>

                <span className="font-light text-gray-500">Doors:</span>
                <span className="text-right">{selectedVariant.doors ?? 1}</span>

                <span className="font-light text-gray-500">Windows:</span>
                <span className="text-right">
                  {selectedVariant.windows ?? 0}
                </span>

                <span className="font-light text-gray-500">Garage:</span>
                <span className="text-right">
                  {selectedVariant.garage ? 'Included' : 'Not included'}
                </span>

                <span className="font-light text-gray-500">Add-ons:</span>
                <span className="text-right">
                  {Array.isArray(selectedVariant.addons) &&
                  selectedVariant.addons.length > 0
                    ? selectedVariant.addons.join(', ')
                    : 'None'}
                </span>

                <span className="font-light text-gray-500">
                  Estimated Price:
                </span>
                <span className="text-right">
                  ${selectedVariant.price?.toFixed(2) ?? '0.00'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="text-center px-6 mt-2">
        {product.description && (
          <div className="text-sm">
            <p>
              {showFullDesc
                ? product.description
                : getShortDescription(product.description)}{' '}
              {product.description.split(' ').length > wordLimit && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="z-50 text-white text-xs transition underline"
                >
                  {showFullDesc ? 'Show less' : 'Learn more'}
                </button>
              )}
            </p>
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
