'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [mainImage, setMainImage] = useState<string | null>(
    product.imageUrl ?? null
  );

  const [selectedVariantIndex] = useState(0);
  const selectedVariant = product.baseVariants?.[selectedVariantIndex];

  const [selectedMaterial, setSelectedMaterial] = useState(
    product.materials?.[0]?.name || ''
  );
  const [selectedRoof, setSelectedRoof] = useState(
    product.roofTypes?.[0]?.name || ''
  );
  const [selectedDoors, setSelectedDoors] = useState<number>(1);
  const [selectedWindows, setSelectedWindows] = useState<number>(0);
  const [includeGarage, setIncludeGarage] = useState<boolean>(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const basePrice = selectedVariant?.basePrice ?? 0;

  const price = useMemo(() => {
    let total = basePrice;

    const materialPrice =
      product.materials?.find((m) => m.name === selectedMaterial)?.price ?? 0;
    const roofPrice =
      product.roofTypes?.find((r) => r.name === selectedRoof)?.price ?? 0;

    total += materialPrice;
    total += roofPrice;

    total += selectedDoors * (product.doorPrice ?? 0);
    total += selectedWindows * (product.windowPrice ?? 0);

    if (includeGarage) {
      total += product.garagePrice ?? 0;
    }

    selectedAddons.forEach((addonName) => {
      const addon = product.addons?.find((a) => a.name === addonName);
      if (addon) total += addon.price;
    });

    return total;
  }, [
    basePrice,
    selectedMaterial,
    selectedRoof,
    selectedDoors,
    selectedWindows,
    includeGarage,
    selectedAddons,
    product,
  ]);

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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
      className="fixed inset-0 bg-flag-red bg-opacity-80 backdrop-blur-md z-50 text-black overflow-y-auto"
    >
      <div className="relative max-w-2xl mx-auto mt-5 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5  z-50 text-black text-xs uppercase transition underline"
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
                      ? 'border-2 border-black'
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

        {/* Instructions */}
        <div className="flex justify-between text-xs font-bold pt-4  italic">
          <span>Select available options for your storage</span>
        </div>
        {/* Variant Details */}
        <div className="w-full mt-4 px-2">
          <div className="border border-black bg-flag-red/20 px-3 py-2 text-xs text-black  space-y-2">
            {/* Dimensions */}
            {selectedVariant?.dimensions && (
              <div className="flex justify-between items-center">
                <label className="text-sm text-black">Dimensions</label>
                <p className="text-sm font-semibold text-black">
                  {selectedVariant.dimensions}
                </p>
              </div>
            )}

            {/* Material */}
            {product.materials && (
              <div className="flex justify-between items-center">
                <label className="text-sm text-black">Material</label>
                <div className="flex gap-2">
                  {product.materials.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setSelectedMaterial(mat.name)}
                      className={`px-3 py-1 rounded-full border text-xs uppercase ${
                        selectedMaterial === mat.name
                          ? 'bg-flag-light-blue text-white border-black'
                          : 'border-black/30 text-black/70 hover:border-black hover:text-black transition'
                      }`}
                    >
                      {capitalize(mat.name)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Roof */}
            {product.roofTypes && (
              <div className="flex justify-between items-center">
                <label className="text-sm text-black">Roof</label>
                <div className="flex gap-2">
                  {product.roofTypes.map((roof) => (
                    <button
                      key={roof.name}
                      onClick={() => setSelectedRoof(roof.name)}
                      className={`px-3 py-1 rounded-full border text-xs uppercase ${
                        selectedRoof === roof.name
                          ? 'bg-flag-light-blue text-white border-black'
                          : 'border-black/30 text-black/70 hover:border-black hover:text-black transition'
                      }`}
                    >
                      {capitalize(roof.name)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Doors */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-black">Doors</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedDoors(num)}
                    className={`px-3 py-1 rounded-full border text-xs ${
                      selectedDoors === num
                        ? 'bg-flag-light-blue text-white border-black'
                        : 'border-black/30 text-black/70 hover:border-black hover:text-black transition'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Windows */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-black">Windows</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedWindows(num)}
                    className={`px-3 py-1 rounded-full border text-xs ${
                      selectedWindows === num
                        ? 'bg-flag-light-blue text-white border-black'
                        : 'border-black/30 text-black/70 hover:border-black hover:text-black transition'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Garage */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-black">Garage</label>
              <input
                type="checkbox"
                checked={includeGarage}
                onChange={(e) => setIncludeGarage(e.target.checked)}
              />
            </div>

            {/* Addons */}
            {product.addons && (
              <>
                <div className="text-sm text-black">Add-ons</div>
                <div className="flex flex-row gap-2 flex-wrap">
                  {product.addons.map((addon) => (
                    <button
                      key={addon.name}
                      onClick={() => toggleAddon(addon.name)}
                      className={`px-3 py-1 rounded-full border text-xs ${
                        selectedAddons.includes(addon.name)
                          ? 'bg-flag-light-blue text-white border-black'
                          : 'border-black/30 text-black/70 hover:border-black hover:text-black transition'
                      }`}
                    >
                      {capitalize(addon.name)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Price */}
            <div className="flex justify-between text-xs font-bold pt-2 border-t border-gray-500 italic">
              <span>Estimated cost</span>
              <span>${price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Message */}
      <div className="flex justify-center text-xs font-bold pt-4  italic">
        <span>We can follow up</span>
      </div>
      {/* CTA */}
      <div className="flex justify-center">
        <div className="my-1 flex flex-col">
          <div className="my-1 space-y-4 w-full  px-2">
            <input
              type="text"
              placeholder="please enter Your full name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="text-xs uppercase w-full p-1 border-b border-flag-light-blue text-center bg-flag-red text-white "
            />
            <input
              type="tel"
              placeholder="best Phone Number to reach you"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="text-xs uppercase w-full p-1 border-b border-flag-light-blue text-center  bg-flag-red text-white "
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="bg-flag-light-blue text-white max-w-sm font-semibold px-6 py-3 my-2 rounded-full shadow-lg text-xs uppercase transition"
          onClick={async () => {
            if (!guestName || !guestPhone) {
              alert('Please enter your name and phone number.');
              return;
            }

            try {
              const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerName: guestName,
                  phone: guestPhone,
                  email: 'guest@example.com', // optional, or remove if not used
                  productId: product._id,
                  totalPrice: price,
                  customizations: {
                    dimensions: selectedVariant?.dimensions,
                    material: selectedMaterial,
                    roofType: selectedRoof,
                    doors: selectedDoors,
                    windows: selectedWindows,
                    garage: includeGarage,
                    addons: selectedAddons,
                  },
                }),
              });

              const clonedResponse = response.clone();

              let result;
              try {
                result = await response.json();
              } catch (jsonError) {
                const text = await clonedResponse.text(); // ✅ now this works
                console.error('❌ Failed to parse JSON. Raw response:', text);
                alert(
                  `Server returned invalid response. Check console. ${jsonError}`
                );
                return;
              }

              if (!response.ok) {
                console.error('❌ Server responded with error:', result);
                alert(result?.message || 'Order creation failed.');
                return;
              }

              alert('Order submitted! Order ID: ' + result.orderId);
              onClose();
            } catch (err) {
              console.error('Unexpected error:', err);
              alert('An error occurred.');
            }
          }}
        >
          submit for a free consultation
        </button>
      </div>
    </motion.div>
  );
}
