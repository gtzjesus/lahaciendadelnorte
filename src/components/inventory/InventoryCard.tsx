'use client';

import Image from 'next/image';
import { useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface InventoryCardProps {
  product: any;
  allCategories: { _id: string; title: string }[];
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  product,
  allCategories,
}) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product.categories?.map((cat: any) => cat._id) || []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSelectedCategoryIds(selectedOptions);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch('/api/update-categories', {
      method: 'PATCH', // o 'POST' si tu API está configurada para eso
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product._id,
        categoryIds: selectedCategoryIds,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Failed to update categories');
    }

    setIsSaving(false);
  };

  return (
    <div className="border border-flag-blue bg-white p-4 flex flex-col md:flex-row gap-6">
      {product.imageUrl && (
        <div className="relative w-40 h-40 flex-shrink-0">
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

      <div className="flex flex-col space-y-2 uppercase text-sm font-mono flex-1">
        <p>
          <strong>Item #:</strong> {product.itemNumber}
        </p>
        <p>
          <strong>Name:</strong> {product.name}
        </p>
        <p>
          <strong>Slug:</strong> {product.slug?.current ?? 'N/A'}
        </p>
        <p>
          <strong>Price:</strong> ${product.price}
        </p>
        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        <div>
          <label htmlFor="category-select" className="block font-semibold mb-1">
            Categories:
          </label>
          <select
            id="category-select"
            multiple
            value={selectedCategoryIds}
            onChange={handleCategoryChange}
            className="border border-gray-300 px-2 py-1 rounded w-full"
          >
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-2 bg-flag-blue text-white px-4 py-2 text-xs uppercase tracking-wide"
          >
            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Categories'}
          </button>
        </div>

        {product.extraImageUrls?.length > 0 && (
          <div>
            <p className="font-semibold mt-4 mb-2">Extra Images:</p>
            <div className="flex gap-2 flex-wrap">
              {product.extraImageUrls.map((url: string, idx: number) => (
                <div key={idx} className="relative w-20 h-20">
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
      </div>
    </div>
  );
};

export default InventoryCard;
