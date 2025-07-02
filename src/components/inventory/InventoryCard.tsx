'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SizeOption {
  label: string;
  price: number;
  stock: number;
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
  const [sizes, setSizes] = useState<SizeOption[]>(
    product.variants?.map((v: any) => ({
      label: v.size,
      price: v.price,
      stock: v.stock,
    })) || [{ label: '', price: 0, stock: 0 }]
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    product.category?._id || ''
  );

  const [allSizes, setAllSizes] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // For image uploads:
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);

  // 🚀 Fetch valid sizes from your backend
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await fetch('/api/sizes');
        const data = await res.json();
        setAllSizes(data.sizes || []);
      } catch (error) {
        console.error('Failed to load sizes', error);
      }
    };
    fetchSizes();
  }, []);

  const handleSaveProduct = async () => {
    setIsSaving(true);

    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('name', name);
    formData.append('categoryId', selectedCategoryId);

    const variants = sizes.map((s) => ({
      size: s.label,
      price: s.price,
      stock: s.stock,
    }));

    formData.append('sizes', JSON.stringify(variants));

    // Append main image file if selected
    if (mainImageFile) {
      formData.append('mainImage', mainImageFile);
    }

    // Append extra image files if any
    extraImageFiles.forEach((file) => {
      formData.append('extraImages', file);
    });

    const res = await fetch('/api/update-product', {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setMainImageFile(null);
      setExtraImageFiles([]);
    } else {
      alert('Failed to update product');
    }

    setIsSaving(false);
  };

  // For preview of newly selected images (optional)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [extraImagesPreview, setExtraImagesPreview] = useState<string[]>([]);

  // Handle main image file selection + preview
  const onMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  // Handle extra images file selection + preview
  const onExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setExtraImageFiles(files);
    setExtraImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div className="border border-flag-blue bg-white p-4 flex flex-col items-center text-center space-y-4">
      {/* Main Image Preview Priority: New upload preview > existing image */}
      {(mainImagePreview || product.imageUrl) && (
        <div className="relative w-40 h-40 rounded overflow-hidden">
          <Image
            src={mainImagePreview || product.imageUrl}
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

        {/* Sizes */}
        <div className="text-left">
          <p className="font-semibold mt-4 mb-1">Sizes, Prices & Stock</p>
          {sizes.map((size, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              {/* Size dropdown from Sanity */}
              <select
                value={size.label}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].label = e.target.value;
                  setSizes(updated);
                }}
                className="border p-2 text-sm w-1/3"
              >
                <option value="">Select Size</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

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
              <input
                type="number"
                value={size.stock}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].stock = parseInt(e.target.value);
                  setSizes(updated);
                }}
                placeholder="Stock"
                className="border p-2 text-sm w-1/4"
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
            onClick={() =>
              setSizes([...sizes, { label: '', price: 0, stock: 0 }])
            }
          >
            + Add Size
          </button>
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

        {/* Extra Images Preview */}
        <div className="text-left mt-4">
          <p className="font-semibold mb-2">Additional Images:</p>
          <div className="flex gap-2 flex-wrap">
            {/* Existing images */}
            {product.extraImageUrls?.map((url: string, idx: number) => (
              <div
                key={`existing-${idx}`}
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

            {/* Newly selected extra image previews */}
            {extraImagesPreview.map((url, idx) => (
              <div
                key={`preview-${idx}`}
                className="relative w-20 h-20 rounded overflow-hidden border-2 border-dashed border-gray-400"
              >
                <Image
                  src={url}
                  alt={`New extra image ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* File inputs for images */}
        <div className="text-left mt-4">
          <label className="block font-semibold mb-1" htmlFor="mainImage">
            Upload Main Image
          </label>
          <input
            type="file"
            id="mainImage"
            accept="image/*"
            onChange={onMainImageChange}
          />
        </div>

        <div className="text-left mt-4">
          <label className="block font-semibold mb-1" htmlFor="extraImages">
            Upload Additional Images (max 4)
          </label>
          <input
            type="file"
            id="extraImages"
            accept="image/*"
            multiple
            onChange={onExtraImagesChange}
          />
        </div>

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
