'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step3WindowsAndDoorsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

const windowOptions = [
  { id: 'none', label: 'No Windows', quantity: 0 },
  { id: 'few', label: 'Few Windows', quantity: 2 },
  { id: 'many', label: 'Many Windows', quantity: 4 },
];

const doorOptions = [1, 2, 3, 4];

export default function Step3WindowsAndDoors({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step3WindowsAndDoorsProps) {
  const initialWindow = windowOptions.find(
    (opt) => opt.quantity === form.windows?.quantity
  );
  const [selectedWindowId, setSelectedWindowId] = useState<string>(
    initialWindow?.id ?? 'few'
  );

  const [doorCount, setDoorCount] = useState<number>(form.doors?.count ?? 1);

  const isValid = selectedWindowId !== '' && doorCount >= 1;

  useEffect(() => {
    const selectedWindowOption = windowOptions.find(
      (w) => w.id === selectedWindowId
    );

    setFormAction((prev) => ({
      ...prev,
      windows: {
        hasWindows: selectedWindowOption?.quantity !== 0,
        quantity: selectedWindowOption?.quantity ?? 0,
      },
      doors: {
        count: doorCount,
      },
    }));
  }, [selectedWindowId, doorCount, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-md lg:text-xl text-center font-bold">
        Choose how many windows and doors for your storage
      </p>

      {/* Window options */}
      <div>
        <p className="text-xs font-bold mb-2">Windows</p>
        <div className="grid gap-3">
          {windowOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedWindowId(option.id)}
              className={`block border text-left px-4 py-2 transition-all ${
                selectedWindowId === option.id
                  ? 'border-flag-red bg-flag-red/80 text-flag-blue'
                  : 'border-white'
              }`}
            >
              <span className="text-sm uppercase font-bold">
                {option.label}
              </span>
              <p className="text-xs uppercase">
                {option.quantity} Window{option.quantity !== 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Door count */}
      <div>
        <p className="text-xs font-bold mb-2 mt-6">Number of doors</p>
        <select
          value={doorCount}
          onChange={(e) => setDoorCount(Number(e.target.value))}
          className="uppercase appearance-none p-2 border text-xs focus:outline-none text-black w-full text-center bg-flag-red"
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
          className="w-1/2 py-2 rounded-full text-xs font-semibold bg-gray-500 text-white uppercase"
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
              : 'bg-flag-red text-flag-blue'
          }`}
        >
          Continue to roof
        </button>
      </div>
    </div>
  );
}
