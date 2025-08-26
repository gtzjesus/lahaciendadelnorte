'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step2MaterialProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
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
  const [customMode, setCustomMode] = useState<boolean>(false);

  const isValid = selectedMaterial.length > 0;

  // Sync form state
  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      material: selectedMaterial,
    }));
  }, [selectedMaterial, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-md lg:text-xl text-center font-bold">
        Choose your outside material
      </p>

      {/* Preset options */}
      {!customMode && (
        <>
          <div className="grid gap-2">
            {materials.map(({ id, name, description }) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedMaterial(id);
                  setCustomMode(false);
                }}
                className={`block border text-left px-4 py-2 cursor-pointer transition-all ${
                  selectedMaterial === id
                    ? 'border-flag-red bg-flag-red/80 text-flag-blue'
                    : 'border-white'
                }`}
              >
                <span className="uppercase text-lg font-semibold">{name}</span>
                <p className="text-sm mt-2">{description}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Nav buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase bg-gray-500 text-white"
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
