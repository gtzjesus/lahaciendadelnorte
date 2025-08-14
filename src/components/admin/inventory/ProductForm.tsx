'use client';

import React from 'react';
import type { Variant, AdminCategory } from '@/types/admin/inventory';

type FormState = {
  itemNumber: string;
  name: string;
  slug: string;
  variants: Variant[];
};

type FormProps = {
  form: FormState;
  setFormAction: React.Dispatch<React.SetStateAction<FormState>>;
  categories: AdminCategory[];
  selectedCategory: string;
  setSelectedCategoryAction: React.Dispatch<React.SetStateAction<string>>;
  mainImageFile: File | null;
  setMainImageFileAction: React.Dispatch<React.SetStateAction<File | null>>;
  extraImageFiles: File[];
  setExtraImageFilesAction: React.Dispatch<React.SetStateAction<File[]>>;
  mainImageRef: React.RefObject<HTMLInputElement>;
  extraImagesRef: React.RefObject<HTMLInputElement>;
  handleUploadAction: () => Promise<void>;
  loading: boolean;
  message: string;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isDuplicateSlugOrNameAction: () => boolean;
  isFormValidAction: () => boolean;
};

const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

export default function ProductForm({
  form,
  setFormAction,
  categories,
  selectedCategory,
  setSelectedCategoryAction,
  mainImageFile,
  setMainImageFileAction,
  extraImageFiles,
  setExtraImageFilesAction,
  mainImageRef,
  extraImagesRef,
  handleUploadAction,
  loading,
  message,
  isDuplicateSlugOrNameAction,
  isFormValidAction,
}: FormProps) {
  const availableSizeOptions = sizeOptions.filter(
    (size) => !form.variants.some((v) => v.size === size)
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 text-black mb-6">
        <input
          name="itemNumber"
          type="text"
          placeholder="Product number"
          value={form.itemNumber}
          onChange={(e) =>
            setFormAction((prev) => ({ ...prev, itemNumber: e.target.value }))
          }
          className="uppercase text-sm border border-red-300 p-3"
        />

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setFormAction((prev) => ({ ...prev, name: e.target.value }))
          }
          className="uppercase text-sm border border-red-300 p-3"
        />

        {isDuplicateSlugOrNameAction() && form.name.trim() && (
          <p className="text-sm text-red-600">
            PRODUCT WITH THIS NAME ALREADY EXISTS
          </p>
        )}

        <div className="relative">
          <select
            className="appearance-none uppercase text-sm border border-red-300 p-3 pr-8 w-full bg-white text-black "
            value={selectedCategory}
            onChange={(e) => setSelectedCategoryAction(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black">
            ▼
          </div>
        </div>

        <div>
          {form.variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_80px_80px_auto] gap-2 mb-2"
            >
              <div className="relative">
                <select
                  value={v.size}
                  onChange={(e) => {
                    const variants = [...form.variants];
                    variants[i].size = e.target.value;
                    setFormAction({ ...form, variants });
                  }}
                  className="appearance-none border border-red-300 p-1 pr-6 text-sm uppercase w-full bg-white "
                >
                  <option value="">Size</option>
                  {sizeOptions
                    .filter(
                      (opt) =>
                        !form.variants.some((v, j) => v.size === opt && j !== i)
                    )
                    .map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs">
                  ▼
                </div>
              </div>

              <input
                type="number"
                step="0.01"
                placeholder="Price"
                className="uppercase border border-red-300 p-1 text-sm w-full"
                value={v.price}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i].price = e.target.value;
                  setFormAction({ ...form, variants });
                }}
              />

              <input
                type="number"
                placeholder="Stock"
                className="border border-red-300 uppercase p-1 text-sm w-full"
                value={v.stock}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i].stock = e.target.value;
                  setFormAction({ ...form, variants });
                }}
              />

              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormAction({
                      ...form,
                      variants: form.variants.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-red-600 font-bold text-xl px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFormAction({
                ...form,
                variants: [
                  ...form.variants,
                  { size: '', price: '', stock: '' },
                ],
              })
            }
            disabled={availableSizeOptions.length === 0}
            className={`text-sm uppercase font-light mb-2 px-2 py-2 ${
              availableSizeOptions.length === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-flag-blue text-black'
            }`}
          >
            + Add new size
          </button>
        </div>
      </div>

      <div className="border border-red-300 p-4 mb-6 space-y-4">
        {/* Main Image Upload */}
        <div>
          <label className="block text-sm uppercase font-light text-black mb-1">
            Add main image
          </label>
          <button
            type="button"
            onClick={() => mainImageRef.current?.click()}
            className="bg-flag-blue text-black text-sm uppercase px-2 py-2  "
          >
            Upload Main Image
          </button>
          <input
            ref={mainImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setMainImageFileAction(e.target.files?.[0] || null)
            }
          />
          {mainImageFile && (
            <p className="mt-2 text-sm text-black">
              Selected: <strong>{mainImageFile.name}</strong>
            </p>
          )}
        </div>

        {/* Extra Images Upload */}
        <div>
          <label className="block text-sm uppercase font-light text-black mb-1">
            Add extra images (up to 4 more)
          </label>
          <button
            type="button"
            onClick={() => extraImagesRef.current?.click()}
            className="bg-flag-blue text-black text-sm uppercase px-2 py-2  "
          >
            Upload Extra Images
          </button>
          <input
            ref={extraImagesRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 4)
                return alert('Only up to 4 extra images allowed.');
              setExtraImageFilesAction(files);
            }}
          />
          {extraImageFiles.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-black space-y-1">
              {extraImageFiles.map((file, i) => (
                <li key={i}>
                  <strong>{file.name}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button
        disabled={loading || !isFormValidAction()}
        onClick={handleUploadAction}
        className={`text-sm uppercase font-light mb-2 px-2 py-2 ${
          loading || !isFormValidAction()
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-flag-red text-black'
        }`}
      >
        {loading ? 'Adding product...' : 'Add Product'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}
