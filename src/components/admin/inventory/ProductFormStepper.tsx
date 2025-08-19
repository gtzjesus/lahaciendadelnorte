'use client';

import React, { useState } from 'react';
import ProductFormStepBasic from '../products/ProductFormStepBasic';
import ProductFormStepVariants from '../products/ProductFormStepVariants';

import type { AddProductDrawerProps as FormProps } from '@/types/admin/inventory';
import ProductFormStepImages from '../products/ProductFormStepImages';
import ProductFormStepSubmit from '../products/ProductFormStepSubmit';

export default function ProductFormStepper(props: FormProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="text-center text-white text-xs font-bold">
        Step {step + 1} of 4
      </div>

      {/* Step content */}
      {step === 0 && <ProductFormStepBasic {...props} onNext={nextStep} />}
      {step === 1 && (
        <ProductFormStepVariants
          {...props}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 2 && (
        <ProductFormStepImages {...props} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 3 && <ProductFormStepSubmit {...props} onBack={prevStep} />}
    </div>
  );
}
