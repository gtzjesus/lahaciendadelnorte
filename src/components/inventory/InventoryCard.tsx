'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

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
  const [categoryId, setCategoryId] = useState(product.category?._id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);

  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (mainImageFile) {
      setMainPreview(URL.createObjectURL(mainImageFile));
    }
  }, [mainImageFile]);

  useEffect(() => {
    setExtraPreviews(extraFiles.map((f) => URL.createObjectURL(f)));
  }, [extraFiles]);

  const onDropMain = (files: File[]) => {
    if (files[0]) setMainImageFile(files[0]);
  };
  const onDropExtra = (files: File[]) => {
    setExtraFiles(files.slice(0, 4));
  };

  const { getRootProps: gm, getInputProps: gi } = useDropzone({
    onDrop: onDropMain,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });
  const { getRootProps: gx, getInputProps: gix } = useDropzone({
    onDrop: onDropExtra,
    accept: { 'image/*': [] },
    maxFiles: 4,
  });

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('sizes', JSON.stringify(sizes));
    if (mainImageFile) formData.append('mainImage', mainImageFile);
    extraFiles.forEach((f) => formData.append('extraImages', f));

    const res = await fetch('/api/update-product', {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Failed to save');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-flag-red border-black border shadow-lg p-6 space-y-6">
      {/* Main Image Upload */}
      <div
        {...gm()}
        className="mx-auto w-40 h-40 rounded-full bg-white flex items-center justify-center cursor-pointer border-2 border-dashed hover:border-flag-blue transition"
      >
        <input {...gi()} />
        {mainPreview || product.imageUrl ? (
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={mainPreview || product.imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <p className="text-gray-500">Upload main image</p>
        )}
      </div>

      {/* Name & Item # */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex">
          <label className="block text-sm font-light uppercase">Item #</label>
          <p className="text-sm">{product.itemNumber || '—'}</p>
        </div>
        <div>
          <label className="block text-xs font-light uppercase mb-2">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="uppercase w-full border px-2 py-2 border-flag-blue text-xs focus:outline-flag-blue"
          />
        </div>
      </div>

      {/* Variants */}
      <div>
        <p className="block text-xs font-light uppercase mb-2">
          Sizes & Pricing
        </p>
        <ul className="uppercase w-full  px-2 py-2  text-xs focus:outline-flag-blue">
          {sizes.map((s, i) => (
            <li
              key={i}
              className="flex border-flag-blue items-center gap-2 p-2 transition"
            >
              <select
                value={s.label}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].label = e.target.value;
                  setSizes(arr);
                }}
                className="border-flag-blue border uppercase flex-2 p-2 text-xs focus:outline-flag-blue"
              >
                <option value="">Select size</option>
                {/** Assuming allSizes available */}
              </select>
              <input
                type="number"
                step="0.01"
                value={s.price}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].price = parseFloat(e.target.value);
                  setSizes(arr);
                }}
                placeholder="Price"
                className="w-24 border border-flag-blue p-2 text-xs focus:outline-flag-blue"
              />
              <input
                type="number"
                value={s.stock}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].stock = parseInt(e.target.value);
                  setSizes(arr);
                }}
                placeholder="Stock"
                className="w-20 border rounded p-2 text-xs focus:outline-flag-blue"
              />
              {sizes.length > 1 && (
                <button
                  onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setSizes([...sizes, { label: '', price: 0, stock: 0 }])
          }
          className="block text-xs font-light uppercase"
        >
          + Add Size
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="uppercase p-2 text-xs">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="uppercase w-full border border-flag-blue px-2 py-1 text-xs focus:outline-flag-blue"
        >
          <option value="">Select category</option>
          {allCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Extra Images Upload */}
      <div
        {...gx()}
        className="border-dashed border-2 p-4 rounded-lg hover:border-flag-blue transition cursor-pointer"
      >
        <input {...gix()} />
        <p className="text-center text-gray-500 text-sm">
          Drag extra images here or click
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {extraPreviews.map((url, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded overflow-hidden"
            >
              <Image
                src={url}
                alt={`extra ${idx}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={clsx(
          'p-4 mb-2 block uppercase text-md font-bold text-center  text-black w-full',
          isSaving ? 'bg-gray-400' : 'bg-flag-blue hover:bg-flag-blue'
        )}
      >
        {isSaving ? 'Saving item' : 'Save Changes'}
      </button>

      {/* Save Feedback */}
      {saved && (
        <div className="uppercase text-sm fixed bottom-4 right-4 bg-flag-blue text-white px-4 py-2 shadow-lg animate-pulse">
          ✔ item Updated!
        </div>
      )}
    </div>
  );
};

export default InventoryCard;
