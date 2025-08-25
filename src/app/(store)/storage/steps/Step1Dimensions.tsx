'use client';

import { CustomShedForm, Dimensions } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';

type Step1DimensionsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
};

// Preset shed dimension options
const presetSheds: { label: string; dimensions: Dimensions }[] = [
  { label: 'Small (6x8x6)', dimensions: { width: 6, length: 8, height: 6 } },
  { label: 'Medium (8x10x8)', dimensions: { width: 8, length: 10, height: 8 } },
  {
    label: 'Large (10x12x10)',
    dimensions: { width: 10, length: 12, height: 10 },
  },
  {
    label: 'Extra Large (12x16x12)',
    dimensions: { width: 12, length: 16, height: 12 },
  },
];

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

  const [selectedPreset, setSelectedPreset] = useState<string>('');

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

  // When preset changes, update dimensions
  useEffect(() => {
    if (!selectedPreset) return;

    const preset = presetSheds.find((p) => p.label === selectedPreset);
    if (preset) {
      setLocalDimensions(preset.dimensions);
    }
  }, [selectedPreset]);

  return (
    <div className="space-y-4 text-white">
      <h1
        className="uppercase font-bold text-4xl lg:text-8xl text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] mb-8"
      >
        Welcome to our Storage Builder
      </h1>

      <p className="text-xs text-center font-bold ">
        Let’s start with your shed’s dimensions!
      </p>

      {/* Length */}
      <div className="flex flex-col gap-2">
        <label className="text-xs ">Length (ft)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 10"
          value={localDimensions.length}
          onChange={(e) =>
            setLocalDimensions((prev) => ({
              ...prev,
              length: Number(e.target.value),
            }))
          }
          className="p-2 border text-xs focus:outline-none text-black"
        />
      </div>

      {/* Width */}
      <div className="flex flex-col gap-2">
        <label className="text-xs ">Width (ft)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 8"
          value={localDimensions.width}
          onChange={(e) =>
            setLocalDimensions((prev) => ({
              ...prev,
              width: Number(e.target.value),
            }))
          }
          className="p-2 border text-xs focus:outline-none text-black"
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
          className="p-2 border text-xs focus:outline-none text-black"
        />
      </div>

      {/* Preset dropdown */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs font-semibold text-white text-center">
          Or
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="appearance-none p-2 border text-xs focus:outline-none text-black text-center"
        >
          <option value="">Select a preset</option>
          {presetSheds.map((preset) => (
            <option key={preset.label} value={preset.label}>
              {preset.label}
            </option>
          ))}
        </select>
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
