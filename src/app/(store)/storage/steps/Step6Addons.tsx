'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useEffect, useState } from 'react';

type Step6AddonsProps = {
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

export default function Step6Addons({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step6AddonsProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    form.addons ?? []
  );

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
      <p className="text-sm lg:text-xl text-center font-bold">
        Pick any optional add-ons
      </p>

      <div className="grid gap-4">
        {addons.map(({ id, name, description }) => (
          <label
            key={id}
            className={`block cursor-pointer rounded-lg border p-4 ${
              selectedAddons.includes(id)
                ? 'border-green bg-green/20'
                : 'border-gray-600'
            }`}
          >
            <input
              type="checkbox"
              name="addons"
              value={id}
              checked={selectedAddons.includes(id)}
              onChange={() => toggleAddon(id)}
              className="mr-2"
            />
            <span className="font-semibold">{name}</span>
            <p className="text-sm opacity-70">{description}</p>
          </label>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-gray-700 text-white"
        >
          Back to roof
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-green text-white"
        >
          review my shed
        </button>
      </div>
    </div>
  );
}
