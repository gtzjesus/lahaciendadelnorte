'use client';

import { useEffect, useState } from 'react';
import type { AdminProductForm } from '@/types/admin/inventory';

interface ProductFormStepSubmitProps {
  form: AdminProductForm;
  handleUploadAction: () => Promise<void>;
  loading: boolean;
  message: string;
  isFormValidAction: () => boolean;
  onBack: () => void;
  mainImageFile: File | null;
}

export default function ProductFormStepSubmit({
  form,
  handleUploadAction,
  loading,
  message,
  isFormValidAction,
  onBack,
  mainImageFile,
}: ProductFormStepSubmitProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mainImageFile) {
      const objectUrl = URL.createObjectURL(mainImageFile);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl); // Clean up
      };
    }
  }, [mainImageFile]);

  return (
    <div className="space-y-4 text-xs font-bold">
      <p className="text-center dark:text-flag-red">
        Review details and add new item once ready <br />
        Happy selling!
      </p>

      <div className="text-center border border-white p-4 space-y-2 dark:text-flag-red">
        <p>
          <strong>Item</strong> {form.itemNumber}
        </p>

        {previewUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover border border-gray-200 rounded"
            />
          </div>
        )}

        <p>{form.name}</p>

        {/* Variants Preview */}
        {form.variants.length > 0 && (
          <div className="mt-4">
            <ul className="space-y-1 text-xs">
              {form.variants.map((variant, index) => (
                <li
                  key={index}
                  className="flex justify-between border border-black dark:text-flag-red border-opacity-5 p-2 "
                >
                  <span>{variant.size}</span>
                  <span>${variant.price}</span>
                  <span>{variant.stock} Stock</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="uppercase flex-1 py-2 rounded-full bg-gray-400 text-white text-xs font-semibold"
          disabled={loading}
        >
          Back
        </button>
        {/* 🐛 TEMP DEBUG UI - REMOVE LATER */}
        <pre className="bg-yellow-100 text-black p-2 text-[10px] rounded overflow-x-auto">
          {JSON.stringify(
            {
              loading,
              isValid: isFormValidAction(),
              message,
              form,
              hasImage: !!mainImageFile,
            },
            null,
            2
          )}
        </pre>

        <button
          type="button"
          onClick={handleUploadAction}
          disabled={loading || !isFormValidAction()}
          className={`uppercase flex-1 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm  ${
            loading || !isFormValidAction()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green text-white   cursor: pointer;'
          }`}
        >
          {loading ? 'Adding item...' : 'Add new item'}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
