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
    description: 'Classic, natural look with great insulation.',
  },
  {
    id: 'metal',
    name: 'Metal',
    description: 'Durable and low maintenance.',
  },
  {
    id: 'vinyl',
    name: 'Vinyl',
    description: 'Resistant to rot and insects, easy to clean.',
  },
  {
    id: 'composite',
    name: 'Composite',
    description: 'Modern, strong, and environmentally friendly.',
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
      <p className="text-sm lg:text-xl text-center font-bold ">
        Choose your material
      </p>

      <div className="grid gap-4">
        {materials.map(({ id, name, description }) => (
          <label
            key={id}
            className={`block cursor-pointer rounded-lg border p-4 ${
              selectedMaterial === id
                ? 'border-green bg-green/20'
                : 'border-gray-600 '
            }`}
          >
            <input
              type="radio"
              name="material"
              value={id}
              checked={selectedMaterial === id}
              onChange={() => setSelectedMaterial(id)}
              className="mr-2"
            />
            <span className="font-semibold">{name}</span>
            <p className="text-sm opacity-70">{description}</p>
          </label>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase bg-gray-700 text-white "
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
              : 'bg-green text-white'
          }`}
        >
          Continue to windows
        </button>
      </div>
    </div>
  );
}
