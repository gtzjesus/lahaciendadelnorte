'use client';

import React, { useEffect } from 'react';
import type { AdminProductForm, AdminCategory } from '@/types/admin/inventory';

type ProductFormStepBasicProps = {
  form: AdminProductForm;
  setFormAction: React.Dispatch<React.SetStateAction<AdminProductForm>>;
  categories: AdminCategory[];
  selectedCategory: string;
  setSelectedCategoryAction: React.Dispatch<React.SetStateAction<string>>;
  isDuplicateSlugOrNameAction: () => boolean;
  onNext: () => void;
};

// Utility to generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with dashes
    .slice(0, 96); // max 96 characters
}

export default function ProductFormStepBasic({
  form,
  setFormAction,
  selectedCategory,
  setSelectedCategoryAction,
  categories,
  isDuplicateSlugOrNameAction,
  onNext,
}: ProductFormStepBasicProps) {
  // Auto-generate slug whenever the name changes
  useEffect(() => {
    if (form.name) {
      const newSlug = generateSlug(form.name);
      setFormAction((prev) => ({
        ...prev,
        slug: newSlug,
      }));
    }
  }, [form.name, setFormAction]);

  return (
    <div className="space-y-4 text-black ">
      <p className="text-xs text-center font-bold dark:text-flag-red">
        Enter item information
      </p>

      {/* Item Number */}
      <div className="flex flex-col gap-2 ">
        <label className="text-xs dark:text-flag-red">
          Item number (auto-generated)
        </label>
        <input
          name="itemNumber"
          type="text"
          placeholder="Product number"
          value={form.itemNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/^0+/, '');
            setFormAction((prev) => ({
              ...prev,
              itemNumber: value,
            }));
          }}
          className="p-2 border border-black border-opacity-5 bg-flag-red text-xs focus:outline-none"
        />
      </div>

      {/* Item Name */}
      <div className="flex flex-col gap-2">
        <label className="text-xs dark:text-flag-red">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setFormAction((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="p-2 border border-black border-opacity-5 bg-flag-red text-xs  focus:outline-none"
        />
        {isDuplicateSlugOrNameAction() && form.name.trim() && (
          <p className="text-xs text-red-600">
            PRODUCT WITH THIS NAME ALREADY EXISTS
          </p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-xs dark:text-flag-red">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategoryAction(e.target.value)}
          className="appearance-none uppercase w-full border border-black border-opacity-5 px-2 py-2 pr-8 text-xs bg-white rounded "
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!form.name || !selectedCategory}
        className={`w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase ${
          !form.name || !selectedCategory
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green text-white'
        }`}
      >
        Continue to next step
      </button>

      {/* Slug (auto-filled) */}
      <div className="flex flex-col gap-2 invisible">
        <label className="text-xs bg-tra">Slug (auto-generated)</label>
        <input
          name="slug"
          type="text"
          placeholder="Slug"
          value={form.slug}
          readOnly
          className="p-2 border border-black border-opacity-5 bg-flag-red text-xs  focus:outline-none cursor-not-allowed"
        />
      </div>
    </div>
  );
}
