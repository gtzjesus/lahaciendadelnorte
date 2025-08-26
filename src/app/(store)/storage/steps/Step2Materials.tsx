'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Step2MaterialProps = {
  form: CustomShedForm;
  setFormAction: React.Dispatch<React.SetStateAction<CustomShedForm>>;
  onNext: () => void;
  onBack: () => void;
};

const materials = [
  {
    id: 'sheeting',
    name: 'Sheet Metal',
    description: 'Lightweight corrugated metal, good ventilation.',
    image: '/(store)/materials/sheet-metal.webp',
  },
  {
    id: 'wood',
    name: 'Wood',
    description: 'Classic natural material with a warm, rustic feel.',
    image: '/(store)/materials/wood.webp',
  },
  {
    id: 'steel',
    name: 'Steel',
    description: 'Heavy-duty metal option, strong and long-lasting.',
    image: '/(store)/materials/steel.webp',
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
      <h1 className="uppercase font-bold text-3xl lg:text-5xl text-white text-center leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] mb-4">
        Choose the exterior material
      </h1>

      <p className="text-sm text-center max-w-xl mx-auto">
        Select the material you want your outside shed built from
      </p>

      <div className="grid gap-2  lg:grid-cols-3 lg:gap-4">
        {materials.map(({ id, name, description, image }) => {
          const isSelected = selectedMaterial === id;

          return (
            <button
              key={id}
              onClick={() => setSelectedMaterial(id)}
              className={`relative border rounded-md overflow-hidden text-left transition-all cursor-pointer flex items-end group ${
                isSelected ? ' ring-4 ring-flag-red ' : 'border-white'
              }`}
            >
              {/* Image as background layer */}
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover object-center absolute inset-0 z-0"
                quality={85}
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-all" />

              {/* Text content on top */}
              <div className="relative z-20 p-4 text-white">
                <p className="uppercase font-semibold text-md">{name}</p>
                <p className="text-sm">{description}</p>
              </div>
            </button>
          );
        })}
      </div>

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
          Continue
        </button>
      </div>
    </div>
  );
}
