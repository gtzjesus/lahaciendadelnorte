'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const variants = product.variants ?? [];
  const [mainImage, setMainImage] = useState<string | null>(
    product.imageUrl ?? null
  );
  const [selectedVariantIndex] = useState(0);

  const selectedVariant = variants[selectedVariantIndex] ?? {};

  const [selectedMaterial, setSelectedMaterial] = useState(
    selectedVariant.material || ''
  );
  const [selectedRoof, setSelectedRoof] = useState(selectedVariant.roof || '');
  const [selectedDoors, setSelectedDoors] = useState<number>(
    selectedVariant.doors ?? 1
  );
  const [selectedWindows, setSelectedWindows] = useState<number>(
    selectedVariant.windows ?? 0
  );
  const [includeGarage, setIncludeGarage] = useState<boolean>(
    selectedVariant.garage ?? false
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    selectedVariant.addons ?? []
  );

  const basePrice = selectedVariant.price ?? 0;

  // Simple price rules
  const price = useMemo(() => {
    let total = basePrice;
    total += selectedDoors * 50;
    total += selectedWindows * 75;
    if (includeGarage) total += 400;
    total += selectedAddons.length * 120;
    return total;
  }, [
    basePrice,
    selectedDoors,
    selectedWindows,
    includeGarage,
    selectedAddons,
  ]);

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Disable scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
        {product.extraImageUrls && (
          <div className="flex gap-2 overflow-x-auto">
            {[product.imageUrl, ...product.extraImageUrls]
              .filter(Boolean)
              .map((url, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 relative flex-shrink-0 border overflow-hidden cursor-pointer ${
                    mainImage === url
                      ? 'border-2 border-white'
                      : 'border-white/30'
                  }`}
                  onClick={() => setMainImage(url!)}
                >
                  <Image
                    src={url!}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        )}

        {/* Variant Details */}
        <div className="w-full mt-6 px-4">
          <div className="border border-gray-500 bg-gray-800/30 p-4 text-xs text-white rounded space-y-3">
            {/* Material */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Material</label>
              <select
                className="bg-gray-900 text-white text-right"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="wood">Wood</option>
                <option value="sheet">Sheet metal</option>
              </select>
            </div>

            {/* Roof */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Roof</label>
              <select
                className="bg-gray-900 text-white text-right"
                value={selectedRoof}
                onChange={(e) => setSelectedRoof(e.target.value)}
              >
                <option value="gable">Gable</option>
                <option value="gambrel">Gambrel</option>
                <option value="flat">Flat</option>
                <option value="skillion">Skillion</option>
              </select>
            </div>

            {/* Doors */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Doors</label>
              <input
                type="number"
                min={1}
                className="bg-gray-900 text-white text-right w-16"
                value={selectedDoors}
                onChange={(e) => setSelectedDoors(Number(e.target.value))}
              />
            </div>

            {/* Windows */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Windows</label>
              <input
                type="number"
                min={0}
                className="bg-gray-900 text-white text-right w-16"
                value={selectedWindows}
                onChange={(e) => setSelectedWindows(Number(e.target.value))}
              />
            </div>

            {/* Garage */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Garage</label>
              <input
                type="checkbox"
                checked={includeGarage}
                onChange={(e) => setIncludeGarage(e.target.checked)}
              />
            </div>

            {/* Addons */}
            <div className="text-sm text-gray-400">Add-ons</div>
            <div className="flex gap-2 flex-wrap">
              {['workbench', 'loft', 'shelving'].map((addon) => (
                <button
                  key={addon}
                  onClick={() => toggleAddon(addon)}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    selectedAddons.includes(addon)
                      ? 'bg-flag-light-blue text-white border-white'
                      : 'border-white/30 text-white/70'
                  }`}
                >
                  {capitalize(addon)}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-600">
              <span>Estimated cost</span>
              <span>${price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <button
          className="bg-flag-light-blue text-white font-semibold px-6 py-3 rounded-full shadow-lg text-sm uppercase transition"
          onClick={() => alert(`Quote request submitted for ${product.name}`)}
        >
          Get a Quote
        </button>
      </div>
    </motion.div>
  );
}
