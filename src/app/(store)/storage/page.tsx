'use client';

import React, { useState } from 'react';
import Step1Dimensions from './steps/Step1Dimensions';
import { CustomShedForm } from '@/types/(store)/storage';
import Step2Material from './steps/Step2Materials';
import Step6Addons from './steps/Step6Addons';
import Step7Review from './steps/Step7Review';
import Background from '@/components/(store)/common/Background';
import Step3WindowsAndDoors from './steps/Step3WindowsAndDoors';
import Step4Roof from './steps/Step4Roof';

const backgroundImages: Record<number, string> = {
  1: '/(store)/steps/dimensions.webp',
  2: '/(store)/steps/materials.webp',
  3: '/(store)/steps/windows.webp', // still works, since it's windows + doors
  4: '/(store)/steps/roof.webp',
  5: '/(store)/steps/addons.webp',
  6: '/(store)/steps/review.webp',
};

export default function StorageBuilderPage() {
  const [form, setForm] = useState<CustomShedForm>({
    dimensions: {
      width: '',
      length: '',
      height: '',
    },
  });

  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = () => {
    console.log('Submitted Shed Design:', form);
    // TODO: connect to backend, Firebase, Supabase, etc.
    alert('Your custom shed design has been submitted!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="relative z-20 max-w-md mx-auto py-10 px-4">
            <Step1Dimensions
              form={form}
              setFormAction={setForm}
              onNext={handleNextStep}
            />
          </div>
        );
      case 2:
        return (
          <Step2Material
            form={form}
            setFormAction={setForm}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <Step3WindowsAndDoors
            form={form}
            setFormAction={setForm}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 4:
        return (
          <Step4Roof
            form={form}
            setFormAction={setForm}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 5:
        return (
          <Step6Addons
            form={form}
            setFormAction={setForm}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 6:
        return (
          <Step7Review
            form={form}
            onBack={handlePrevStep}
            onSubmit={handleSubmit}
          />
        );

      case 7:
        return (
          <Step7Review
            form={form}
            onBack={handlePrevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return (
          <div className="text-center text-black">
            <p>You’re done with step {currentStep}, more coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background
        imageSrc={backgroundImages[currentStep] || '/(store)/fallback.webp'}
      />

      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        {renderStep()}
      </div>
    </div>
  );
}
