'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useEffect, useState } from 'react';

type Step4DoorsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

const doorOptions = [1, 2, 3, 4];

export default function Step4Doors({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step4DoorsProps) {
  const [doorCount, setDoorCount] = useState<number>(form.doors?.count ?? 1);

  const isValid = doorCount >= 1;

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      doors: {
        count: doorCount,
      },
    }));
  }, [doorCount, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-sm lg:text-xl text-center font-bold">
        Select how many doors your shed needs
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold">Number of doors</label>
        <select
          value={doorCount}
          onChange={(e) => setDoorCount(Number(e.target.value))}
          className="p-2 border text-xs text-black focus:outline-none"
        >
          {doorOptions.map((num) => (
            <option key={num} value={num}>
              {num} Door{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold bg-gray-700 text-white uppercase"
        >
          Back to windows
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
          Continue to roof
        </button>
      </div>
    </div>
  );
}
