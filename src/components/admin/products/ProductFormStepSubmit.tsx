'use client';

import type { AdminProductForm } from '@/types/admin/inventory';

interface ProductFormStepSubmitProps {
  form: AdminProductForm;
  handleUploadAction: () => Promise<void>;
  loading: boolean;
  message: string;
  isFormValidAction: () => boolean;
  onBack: () => void;
}

export default function ProductFormStepSubmit({
  form,
  handleUploadAction,
  loading,
  message,
  isFormValidAction,
  onBack,
}: ProductFormStepSubmitProps) {
  return (
    <div className="space-y-4 text-white text-xs font-bold">
      <p className="text-center">
        Review your product details and submit when ready.
      </p>

      <div className="border border-white p-4 space-y-2">
        <p>
          <strong>Item Number:</strong> {form.itemNumber}
        </p>
        <p>
          <strong>Name:</strong> {form.name}
        </p>
        <p>
          <strong>Slug:</strong> {form.slug}
        </p>
        <p>
          <strong>Variants:</strong> {form.variants.length}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 rounded-full bg-gray-700 text-white text-xs font-semibold"
          disabled={loading}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleUploadAction}
          disabled={loading || !isFormValidAction()}
          className={`flex-1 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm ${
            loading || !isFormValidAction()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green text-white'
          }`}
        >
          {loading ? 'Adding item...' : 'Add item'}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
