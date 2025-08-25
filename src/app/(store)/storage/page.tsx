'use client';

import React, { useState } from 'react';
import Step1Dimensions from './steps/Step1Dimensions';

type CustomShedForm = {
  dimensions: {
    width: number | '';
    length: number | '';
    height: number | '';
  };
  // other steps coming soon!
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Dimensions
            form={form}
            setFormAction={setForm}
            onNext={handleNextStep}
          />
        );
      // case 2:
      //   return <Step2Material ... />;
      default:
        return (
          <div className="text-center text-black">
            <p>Youre done with step {currentStep}, more coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1
        className="uppercase font-bold text-4xl lg:text-8xl text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
      >
        Welcome to our Storage Builder
      </h1>

      <h1
        className="uppercase font-bold text-md lg:text-8xl text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] mt-8"
      >
        Start Building by adding information below about your storage!
      </h1>
      {renderStep()}
    </div>
  );
}
