'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useEffect, useState } from 'react';

type Step5AddonsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

const addons = [
  {
    id: 'garage',
    name: 'Garage Door',
    description: 'A large rolling door for vehicle access.',
  },
  {
    id: 'ramp',
    name: 'Ramp',
    description: 'Easier entry for wheeled equipment.',
  },
  {
    id: 'skylight',
    name: 'Skylight',
    description: 'Natural light through the roof.',
  },
  {
    id: 'loft',
    name: 'Loft Storage',
    description: 'Extra overhead storage space.',
  },
  {
    id: 'shelves',
    name: 'Built-in Shelves',
    description: 'Integrated shelving for organization.',
  },
];

export default function Step5Addons({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step5AddonsProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    form.addons ?? []
  );
  const isValid = selectedAddons.length > 0;
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      addons: selectedAddons,
    }));
  }, [selectedAddons, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-md lg:text-xl text-center font-bold">
        Pick any optional add-ons for your storage
      </p>

      <div className="grid gap-4">
        {addons.map(({ id, name, description }) => (
          <label
            key={id}
            className={`block border text-left px-4 py-2 cursor-pointer transition-all ${
              selectedAddons.includes(id)
                ? 'border-flag-red bg-flag-red/80 text-flag-blue'
                : 'border-white'
            }`}
          >
            <input
              type="checkbox"
              name="addons"
              value={id}
              checked={selectedAddons.includes(id)}
              onChange={() => toggleAddon(id)}
              className="hidden"
            />
            <span className="font-semibold">{name}</span>
            <p className="text-sm ">{description}</p>
          </label>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-gray-500 text-white"
        >
          Back to roof
        </button>

        <button
          type="button"
          onClick={onNext}
          className={`w-1/2 py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase ${
            !isValid
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-flag-red text-flag-blue'
          }`}
        >
          review my shed
        </button>
      </div>
    </div>
  );
}
