'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step4RoofProps = {
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

export default function Step4Roof({
  form,
  setFormAction,
  onNext,
  onBack,
}: Step4RoofProps) {
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
      <p className="text-md lg:text-xl text-center font-bold">
        Go ahead and choose the roof style that fits
      </p>

      <div className="grid gap-2 ">
        {roofStyles.map(({ id, name, description }) => (
          <label
            key={id}
            className={` block border text-left px-4 py-2 cursor-pointer transition-all ${
              selectedRoof === id
                ? 'border-flag-red bg-flag-red/80 text-flag-blue'
                : 'border-white'
            }`}
          >
            <input
              type="radio"
              name="roof"
              value={id}
              checked={selectedRoof === id}
              onChange={() => setSelectedRoof(id)}
              className="hidden "
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
          Back
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
          last step
        </button>
      </div>
    </div>
  );
}
