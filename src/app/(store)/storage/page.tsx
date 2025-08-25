'use client';

import React, { useState } from 'react';
import Step1Dimensions from './steps/Step1Dimensions';
import { CustomShedForm } from '@/types/(store)/storage';

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
      default:
        return (
          <div className="text-center text-black">
            <p>You’re done with step {currentStep}, more coming soon!</p>
          </div>
        );
    }
  };

  return <div className="max-w-md mx-auto py-10 px-4">{renderStep()}</div>;
}
