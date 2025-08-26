'use client';

import { CustomShedForm, Dimensions } from '@/types/(store)/storage';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Step1DimensionsProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
};

const presetSheds: {
  label: string;
  dimensions: Dimensions;
  image: string;
  description: string;
}[] = [
  {
    label: 'Tool',
    dimensions: { width: 6, length: 8, height: 6 },
    image: '/(store)/storage/tool-shed.webp',
    description:
      'Fits in most backyards and provides just enough space to organize lawn equipment, hand tools, or even gardening supplies. A small footprint and efficient layout.',
  },
  {
    label: 'Yard',
    dimensions: { width: 8, length: 10, height: 8 },
    image: '/(store)/storage/yard-shed.webp',
    description:
      'Offers extra walking room and vertical space for shelves, hooks, or a small workspace while still being compact enough for suburban lots and tight spaces.',
  },
  {
    label: 'Work',
    dimensions: { width: 10, length: 12, height: 10 },
    image: '/(store)/storage/work-shed.webp',
    description:
      'Ideal for anyone needing a functional workshop. This shed can hold large equipment, a workbench, power tools, and storage units. With generous interior space and plenty of headroom.',
  },
  {
    label: 'Utility',
    dimensions: { width: 12, length: 16, height: 12 },
    image: '/(store)/storage/utility-shed.webp',
    description:
      'A large multi-purpose shed with room for everything — from ATVs to seasonal décor. Designed for serious storage or light commercial use and can double as a mini garage or secondary workspace.',
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

  const [customMode, setCustomMode] = useState<boolean>(false);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('');

  const isValid =
    Number(localDimensions.width) > 0 &&
    Number(localDimensions.length) > 0 &&
    Number(localDimensions.height) > 0;

  useEffect(() => {
    setFormAction((prev) => ({
      ...prev,
      dimensions: localDimensions,
    }));
  }, [localDimensions, setFormAction]);

  const handlePresetSelect = (label: string, dims: Dimensions) => {
    setSelectedPresetLabel(label);
    setLocalDimensions(dims);
    setCustomMode(false);
  };

  const selectedShed = presetSheds.find(
    (shed) => shed.label === selectedPresetLabel
  );

  return (
    <div className="space-y-6 text-white">
      <h1 className="uppercase font-bold text-3xl lg:text-5xl text-white text-center leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] mb-4">
        Submit your storage idea in seconds
      </h1>

      {!customMode && (
        <>
          <p className="text-md lg:text-xl text-center font-bold">
            Start by choosing a shed size
          </p>

          <div className="grid gap-3">
            {presetSheds.map(({ label, dimensions, image }) => {
              const isSelected = selectedPresetLabel === label;

              return (
                <button
                  key={label}
                  onClick={() => handlePresetSelect(label, dimensions)}
                  className={`block text-left px-4 py-3 transition-all border rounded-md cursor-pointer ${
                    isSelected
                      ? 'border-flag-blue bg-flag-red/90 text-flag-blue'
                      : 'border-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="uppercase text-md font-semibold">
                      {label} Shed
                    </span>
                    <p className="text-xs">
                      {dimensions.length}ft L{' '}
                      <strong className="text-flag-red">x</strong>{' '}
                      {dimensions.width}ft W{' '}
                      <strong className="text-flag-red">x</strong>{' '}
                      {dimensions.height}ft H
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <Image
                        src={image}
                        alt={`${label} Shed`}
                        width={300}
                        height={200}
                        className=" border border-flag-red"
                      />
                      <p className="text-xs text-center italic">
                        {selectedShed?.description}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-center mt-2">or</p>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => {
                setCustomMode(true);
                setSelectedPresetLabel('');
                setLocalDimensions({ width: '', length: '', height: '' });
              }}
              className="text-xs uppercase font-bold underline text-white"
            >
              enter custom dimensions
            </button>
          </div>
        </>
      )}

      {/* Custom Input Mode */}
      {customMode && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-bold text-center">
            Enter your custom dimensions (ft)
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-xs">Length</label>
            <input
              type="number"
              min="1"
              value={localDimensions.length}
              onChange={(e) =>
                setLocalDimensions((prev) => ({
                  ...prev,
                  length: Number(e.target.value),
                }))
              }
              className="p-2 border text-xs text-black"
              placeholder="e.g. 10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs">Width</label>
            <input
              type="number"
              min="1"
              value={localDimensions.width}
              onChange={(e) =>
                setLocalDimensions((prev) => ({
                  ...prev,
                  width: Number(e.target.value),
                }))
              }
              className="p-2 border text-xs text-black"
              placeholder="e.g. 8"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs">Height</label>
            <input
              type="number"
              min="1"
              value={localDimensions.height}
              onChange={(e) =>
                setLocalDimensions((prev) => ({
                  ...prev,
                  height: Number(e.target.value),
                }))
              }
              className="p-2 border text-xs text-black"
              placeholder="e.g. 6"
            />
          </div>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => {
                setCustomMode(false);
              }}
              className="text-xs uppercase font-bold underline text-white"
            >
              back to presets
            </button>
          </div>
        </div>
      )}

      {/* Continue */}
      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm uppercase mt-4 ${
          !isValid
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-flag-red text-flag-blue'
        }`}
      >
        Continue to material
      </button>
    </div>
  );
}
