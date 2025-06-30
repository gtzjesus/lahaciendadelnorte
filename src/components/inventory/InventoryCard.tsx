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

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSelectedCategoryIds(selectedOptions);
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    const res = await fetch('/api/update-product', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product._id,
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryIds: selectedCategoryIds,
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

        <label className="flex flex-col text-left">
          <span className="font-semibold">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          />
        </label>

        <label className="flex flex-col text-left">
          <span className="font-semibold">Price</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          />
        </label>

        <label className="flex flex-col text-left">
          <span className="font-semibold">Stock</span>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          />
        </label>

        <div className="text-left">
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
        </div>

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
