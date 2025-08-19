'use client';

import React from 'react';
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

export default function ProductFormStepBasic({
  form,
  setFormAction,
  selectedCategory,
  setSelectedCategoryAction,
  categories,
  isDuplicateSlugOrNameAction,
  onNext,
}: ProductFormStepBasicProps) {
  return (
    <div className="space-y-4 text-white">
      <p className="text-xs text-center font-bold">Step 1: Basic Information</p>

      <div className="flex flex-col gap-2">
        <label className="text-xs">Item number (auto-generated)</label>
        <input
          name="itemNumber"
          type="text"
          placeholder="Product number"
          value={form.itemNumber}
          onChange={(e) =>
            setFormAction((prev) => ({
              ...prev,
              itemNumber: e.target.value,
            }))
          }
          className="p-2 border border-white bg-transparent text-xs focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs">Item name</label>
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
          className="p-2 border border-white bg-transparent text-xs focus:outline-none"
        />
        {isDuplicateSlugOrNameAction() && form.name.trim() && (
          <p className="text-xs text-red-600">
            PRODUCT WITH THIS NAME ALREADY EXISTS
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategoryAction(e.target.value)}
          className="p-2 border border-white bg-transparent text-xs text-black focus:outline-none"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!form.name || !selectedCategory}
        className={`w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm ${
          !form.name || !selectedCategory
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green text-white'
        }`}
      >
        Continue
      </button>
    </div>
  );
}
