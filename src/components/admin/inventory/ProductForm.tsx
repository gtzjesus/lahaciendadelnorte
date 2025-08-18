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
      <div className="grid grid-cols-1 gap-1 text-black mb-1 font-bold overflow-x-hidden">
        <p className="text-xs text-center text-white mb-1 ">
          Please fill out all fields below to add a new item.
        </p>
        <div className="flex flex-col  gap-1">
          <p className="text-xs  text-white ">Item number (auto-generated)</p>
          <input
            name="itemNumber"
            type="text"
            placeholder="Product number"
            value={form.itemNumber}
            onChange={(e) =>
              setFormAction((prev) => ({ ...prev, itemNumber: e.target.value }))
            }
            className="p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all"
          />
          <p className="text-xs  text-white ">Item name</p>

          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setFormAction((prev) => ({ ...prev, name: e.target.value }))
            }
            className=" p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all"
          />
        </div>
        {isDuplicateSlugOrNameAction() && form.name.trim() && (
          <p className="text-xs text-red-600">
            PRODUCT WITH THIS NAME ALREADY EXISTS
          </p>
        )}
        <p className="text-xs  text-white ">Item category</p>

        <div className="relative">
          <select
            className="appearance-none   p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all w-full "
            value={selectedCategory}
            onChange={(e) => setSelectedCategoryAction(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 top-4 -translate-y-1/2 text-flag-blue text-xs">
            ▼
          </div>
        </div>

        <div>
          <p className="text-xs text-white mb-1 ">
            Item sizes (must include at least 1 size)
          </p>
          {form.variants.map((v, i) => (
            <div key={i} className="grid gap-1 mb-1 border border-white p-4">
              <div className="relative gap-1  ">
                <div className="flex justify-between">
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].size = e.target.value;
                      setFormAction({ ...form, variants });
                    }}
                    className="appearance-none p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all mb-1 w-3/4"
                  >
                    <option value="">Size</option>
                    {sizeOptions
                      .filter(
                        (opt) =>
                          !form.variants.some(
                            (v, j) => v.size === opt && j !== i
                          )
                      )
                      .map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>

                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormAction({
                          ...form,
                          variants: form.variants.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-600 font-bold text-2xl px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1 ">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className=" p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all "
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
                    className=" p-2  border-white text-xs focus:outline-none focus:ring-0 transition-all"
                    value={v.stock}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].stock = e.target.value;
                      setFormAction({ ...form, variants });
                    }}
                  />
                </div>
              </div>
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
            className={`w-full py-2 rounded-full text-xs font-semibold  transition duration-200 ease-in-out shadow-sm ${
              availableSizeOptions.length === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-flag-blue text-black'
            }`}
          >
            + Add new size
          </button>
        </div>
      </div>

      <div className="border border-white p-4 mb-6 space-y-4 font-bold">
        <p className="flex justify-center text-xs text-white mb-1">
          Add images
        </p>
        {/* Main Image Upload */}
        <div className="flex gap-5 w-full mt-4">
          <button
            type="button"
            onClick={() => mainImageRef.current?.click()}
            className="w-full py-2 rounded-full text-xs font-semibold  transition duration-200 ease-in-out shadow-sm bg-flag-blue"
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
            <p className="mt-2 text-xs text-black">
              Selected: <strong>{mainImageFile.name}</strong>
            </p>
          )}
          <button
            type="button"
            onClick={() => extraImagesRef.current?.click()}
            className="w-full py-2 rounded-full text-xs font-semibold  transition duration-200 ease-in-out shadow-sm bg-flag-blue"
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
            <ul className="mt-2 list-disc list-inside text-xs text-black space-y-1">
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
        className={`w-full py-2 rounded-full text-xs font-semibold  transition duration-200 ease-in-out shadow-sm bg-flag-blue ${
          loading || !isFormValidAction()
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green text-white'
        }`}
      >
        {loading ? 'Adding item...' : 'Add item'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}
