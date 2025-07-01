'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SizeOption {
  label: string;
  price: number;
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface InventoryCardProps {
  product: any;
  allCategories: { _id: string; title: string }[];
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  product,
  allCategories,
}) => {
  const [name, setName] = useState(product.name || '');
  const [stock, setStock] = useState(product.stock?.toString() || '');
  const [sizes, setSizes] = useState<SizeOption[]>(
    product.sizes || [{ label: '', price: 0 }]
  );
  const [flavors, setFlavors] = useState<string[]>(product.flavors || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    product.category?._id || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProduct = async () => {
    setIsSaving(true);

    const res = await fetch('/api/update-product', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        name,
        stock: parseInt(stock),
        sizes,
        flavors,
        categoryId: selectedCategoryId,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Failed to update product');
    }

    setIsSaving(false);
  };

  return (
    <div className="border border-flag-blue bg-white p-4 flex flex-col items-center text-center space-y-4">
      {product.imageUrl && (
        <div className="relative w-40 h-40 rounded overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="160px"
            priority
          />
        </div>
      )}

      <div className="flex flex-col space-y-2 uppercase text-sm font-mono w-full max-w-md">
        <p>
          <strong>Item #:</strong> {product.itemNumber}
        </p>

        {/* Name */}
        <label className="flex flex-col text-left">
          <span className="font-semibold">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          />
        </label>

        {/* Stock */}
        <label className="flex flex-col text-left">
          <span className="font-semibold">Stock</span>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          />
        </label>

        {/* Sizes */}
        <div className="text-left">
          <p className="font-semibold mt-4 mb-1">Sizes & Prices</p>
          {sizes.map((size, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={size.label}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].label = e.target.value;
                  setSizes(updated);
                }}
                placeholder="Size (e.g. Small)"
                className="border p-2 text-sm w-1/2"
              />
              <input
                type="number"
                step="0.01"
                value={size.price}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].price = parseFloat(e.target.value);
                  setSizes(updated);
                }}
                placeholder="Price"
                className="border p-2 text-sm w-1/3"
              />
              {sizes.length > 1 && (
                <button
                  onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))}
                  className="text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className="text-xs underline"
            onClick={() => setSizes([...sizes, { label: '', price: 0 }])}
          >
            + Add Size
          </button>
        </div>

        {/* Flavors */}
        <div className="text-left">
          <label className="block font-semibold mb-1">Flavors</label>
          <select
            multiple
            className="border p-2 text-sm w-full h-32"
            value={flavors}
            onChange={(e) =>
              setFlavors(Array.from(e.target.selectedOptions, (o) => o.value))
            }
          >
            {[
              'hawaiian delight',
              'blue moon',
              'chocolate',
              'velvet rose',
              'yellow rode',
              'pink lady',
              'creamy banana',
              'tamarindo',
              'mango',
              'cantaloupe',
              'natural lime',
              'guava',
              'mazapan',
            ].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="text-left">
          <label className="block font-semibold mb-1">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded w-full"
          >
            <option value="">Select category</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Extra Images */}
        {product.extraImageUrls?.length > 0 && (
          <div className="text-left">
            <p className="font-semibold mt-4 mb-2">Additional Images:</p>
            <div className="flex gap-2 flex-wrap">
              {product.extraImageUrls.map((url: string, idx: number) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`Extra image ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveProduct}
          disabled={isSaving}
          className="mt-4 bg-flag-blue text-white px-4 py-2 text-xs uppercase tracking-wide"
        >
          {isSaving
            ? 'updating...'
            : saved
              ? '✔ firework updated!'
              : 'update firework'}
        </button>
      </div>
    </div>
  );
};

export default InventoryCard;
