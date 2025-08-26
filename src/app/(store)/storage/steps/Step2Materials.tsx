'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step2MaterialProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void; // new prop for back navigation
};

const materials = [
  {
    id: 'wood',
    name: 'Wood',
    description: 'Classic natural material with a warm, rustic feel.',
  },
  {
    id: 'sheeting',
    name: 'Sheet Metal',
    description:
      'Lightweight corrugated metal, great for cost and ventilation.',
  },
  {
    id: 'steel',
    name: 'Steel',
    description: 'Heavy-duty metal option, strong and long-lasting.',
  },
];

export default function Step2Material({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step2MaterialProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    form.material ?? ''
  );

  const isValid = selectedMaterial.length > 0;

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      material: selectedMaterial,
    }));
  }, [selectedMaterial, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-md lg:text-xl text-center font-bold ">
        Choose your material
      </p>

      <div className="grid gap-4 ">
        {materials.map(({ id, name, description }) => (
          <label
            key={id}
            onClick={() => setSelectedMaterial(id)}
            className={`block cursor-pointer border p-6 transition-all text-center ${
              selectedMaterial === id
                ? 'border-flag-red bg-flag-red/60 text-flag-blue'
                : 'border-white'
            }`}
          >
            {/* Hidden radio input */}
            <input
              type="radio"
              name="material"
              value={id}
              checked={selectedMaterial === id}
              onChange={() => setSelectedMaterial(id)}
              className="hidden"
            />
            <span className="font-semibold">{name}</span>
            <p className="text-sm">{description}</p>
          </label>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase bg-gray-500 text-white "
        >
          Back to dimensions
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`w-1/2 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase ${
            !isValid
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-flag-red text-flag-blue'
          }`}
        >
          Continue to windows
        </button>
      </div>
    </div>
  );
}
