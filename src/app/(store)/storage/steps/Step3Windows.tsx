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
  const [quantity, setQuantity] = useState<number | ''>(
    form.windows?.quantity ?? ''
  );

  const isValid = quantity !== '' && Number(quantity) >= 0;

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      windows: {
        hasWindows: Number(quantity) > 0,
        quantity: Number(quantity),
      },
    }));
  }, [quantity, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-lg text-center font-semibold">
        How many windows for your storage?
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold">Number of windows</label>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="p-2 border text-xs text-black focus:outline-none"
          placeholder="e.g. 2"
        />
      </div>

      <p className="text-sm text-center italic opacity-70">
        Enter <strong>0</strong> if you don’t want any windows
      </p>

      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 rounded-full text-xs font-semibold bg-gray-500 text-white uppercase"
        >
          Back to material
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm ${
            !isValid
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-flag-red text-flag-blue'
          }`}
        >
          Continue to doors
        </button>
      </div>
    </div>
  );
}
