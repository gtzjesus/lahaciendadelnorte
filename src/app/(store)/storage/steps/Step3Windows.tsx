'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useEffect, useState } from 'react';

type Step3WindowsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

export default function Step3Windows({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step3WindowsProps) {
  const [hasWindows, setHasWindows] = useState<boolean>(
    form.windows?.hasWindows ?? false
  );

  const [quantity, setQuantity] = useState<number | ''>(
    form.windows?.hasWindows ? (form.windows?.quantity ?? '') : ''
  );

  const isValid = !hasWindows || (hasWindows && Number(quantity) > 0);

  // Reset quantity when windows are disabled
  useEffect(() => {
    if (!hasWindows) {
      setQuantity('');
    }
  }, [hasWindows]);

  // Sync with parent state
  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      windows: {
        hasWindows,
        quantity: hasWindows ? Number(quantity) : 0,
      },
    }));
  }, [hasWindows, quantity, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-sm lg:text-xl text-center font-bold">Any windows?</p>

      {/* Toggle Yes/No */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase ${
            hasWindows ? 'bg-green text-white' : 'bg-gray-600'
          }`}
          onClick={() => setHasWindows(true)}
        >
          Yes windows
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase ${
            !hasWindows ? 'bg-green text-white' : 'bg-gray-600'
          }`}
          onClick={() => setHasWindows(false)}
        >
          No windows
        </button>
      </div>

      {/* Quantity Input */}
      {hasWindows && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold">Number of windows</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="p-2 border text-xs text-black focus:outline-none"
            placeholder="e.g. 2"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold bg-gray-700 text-white uppercase"
        >
          Back to material
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`w-1/2 py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm ${
            !isValid
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green text-white'
          }`}
        >
          Continue to doors
        </button>
      </div>
    </div>
  );
}
