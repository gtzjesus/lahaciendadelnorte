'use client';

import type { AdminProductForm, Variant } from '@/types/admin/inventory';
import React from 'react';

type StepProps = {
  form: AdminProductForm;
  setFormAction: React.Dispatch<React.SetStateAction<AdminProductForm>>;
  onNext: () => void;
  onBack: () => void;
};
const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

export default function ProductFormStepVariants({
  form,
  setFormAction,
  onNext,
  onBack,
}: StepProps) {
  const availableSizeOptions = sizeOptions.filter(
    (size) => !form.variants.some((v) => v.size === size)
  );

  const handleAddVariant = () => {
    setFormAction((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: '', price: '', stock: '' }],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormAction((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };
  const handleChange = (index: number, key: keyof Variant, value: string) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [key]: value,
    };
    setFormAction((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const canProceed =
    form.variants.length > 0 &&
    form.variants.every((v) => v.size && v.price && v.stock);

  return (
    <div className="space-y-4 text-white">
      <p className="text-xs font-bold">
        Item sizes (must include at least 1 size)
      </p>

      {form.variants.map((v, i) => (
        <div key={i} className="grid gap-1 mb-1 border border-white p-4">
          <div className="flex justify-between items-center mb-2">
            <select
              value={v.size}
              onChange={(e) => handleChange(i, 'size', e.target.value)}
              className="appearance-none p-2 border-white text-xs focus:outline-none w-3/4"
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

            {form.variants.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveVariant(i)}
                className="text-red-600 font-bold text-2xl px-2"
              >
                ✕
              </button>
            )}
          </div>

          <input
            type="number"
            step="0.01"
            placeholder="Price"
            className="p-2 border-white text-xs focus:outline-none mb-1"
            value={v.price}
            onChange={(e) => handleChange(i, 'price', e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            className="p-2 border-white text-xs focus:outline-none"
            value={v.stock}
            onChange={(e) => handleChange(i, 'stock', e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddVariant}
        disabled={availableSizeOptions.length === 0}
        className={`w-full py-2 rounded-full text-xs font-semibold transition ${
          availableSizeOptions.length === 0
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-flag-blue text-black'
        }`}
      >
        + Add new size
      </button>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 mr-2 py-2 bg-gray-500 text-white text-xs font-semibold rounded-full"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`w-1/2 py-2 text-xs font-semibold rounded-full transition ${
            canProceed
              ? 'bg-green text-white'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
