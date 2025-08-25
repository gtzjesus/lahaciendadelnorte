'use client';

import { CustomShedForm, Dimensions } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step1DimensionsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
};

export default function Step1Dimensions({
  form,
  setFormAction,
  onNext,
}: Step1DimensionsProps) {
  const [localDimensions, setLocalDimensions] = useState<Dimensions>({
    width: form.dimensions?.width ?? '',
    length: form.dimensions?.length ?? '',
    height: form.dimensions?.height ?? '',
  });

  const isValid =
    Number(localDimensions.width) > 0 &&
    Number(localDimensions.length) > 0 &&
    Number(localDimensions.height) > 0;

  useEffect(() => {
    setFormAction((prev: CustomShedForm) => ({
      ...prev,
      dimensions: localDimensions,
    }));
  }, [localDimensions, setFormAction]);

  return (
    <div className="space-y-4 text-white">
      <p className="text-xs text-center font-bold ">
        Let’s start with your shed’s dimensions!
        <br />
        Enter width, length and height in feet.
      </p>

      {/* Length */}
      <div className="flex flex-col gap-2">
        <label className="text-xs ">Length (ft)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 12"
          value={localDimensions.length}
          onChange={(e) =>
            setLocalDimensions((prev) => ({
              ...prev,
              length: Number(e.target.value),
            }))
          }
          className="p-2 border  text-xs focus:outline-none text-black"
        />
      </div>

      {/* Width */}
      <div className="flex flex-col gap-2">
        <label className="text-xs ">Width (ft)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 10"
          value={localDimensions.width}
          onChange={(e) =>
            setLocalDimensions((prev) => ({
              ...prev,
              width: Number(e.target.value),
            }))
          }
          className="p-2 border  text-xs focus:outline-none text-black"
        />
      </div>

      {/* Height */}
      <div className="flex flex-col gap-2">
        <label className="text-xs">Height (ft)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 8"
          value={localDimensions.height}
          onChange={(e) =>
            setLocalDimensions((prev) => ({
              ...prev,
              height: Number(e.target.value),
            }))
          }
          className="p-2 border  text-xs focus:outline-none text-black"
        />
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase ${
          !isValid
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green text-white'
        }`}
      >
        Continue to next step
      </button>
    </div>
  );
}
