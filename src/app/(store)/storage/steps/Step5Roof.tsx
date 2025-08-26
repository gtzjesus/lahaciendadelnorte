'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step5RoofProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

const roofStyles = [
  {
    id: 'gable',
    name: 'Gable Roof',
    description: 'Classic triangular design, sheds water easily.',
  },
  {
    id: 'barn',
    name: 'Barn Roof',
    description: 'Extra headroom and loft space.',
  },
  {
    id: 'flat',
    name: 'Flat Roof',
    description: 'Modern, minimalist, easy to build.',
  },
  {
    id: 'saltbox',
    name: 'Saltbox Roof',
    description: 'Asymmetrical, unique look with great runoff.',
  },
];

export default function Step5Roof({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step5RoofProps) {
  const [selectedRoof, setSelectedRoof] = useState<string>(
    form.roof?.style ?? ''
  );

  const isValid = selectedRoof.length > 0;

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      roof: {
        style: selectedRoof,
      },
    }));
  }, [selectedRoof, setFormAction]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-md lg:text-xl text-center font-bold ">
        Go ahead and choose your roof style
      </p>

      <div className="grid gap-4">
        {roofStyles.map(({ id, name, description }) => (
          <label
            key={id}
            className={`block cursor-pointer border p-6 transition-all text-center ${
              selectedRoof === id
                ? 'border-flag-red bg-flag-red/60 text-flag-blue'
                : 'border-white'
            }`}
          >
            <input
              type="radio"
              name="roof"
              value={id}
              checked={selectedRoof === id}
              onChange={() => setSelectedRoof(id)}
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
          className="w-1/2 py-2 rounded-full text-xs font-semibold bg-gray-500 text-white uppercase"
        >
          Back to doors
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
          Continue to add-ons
        </button>
      </div>
    </div>
  );
}
