'use client';

import { CustomShedForm } from '@/types/(store)/storage';
import React from 'react';

type Step7ReviewProps = {
  form: CustomShedForm;
  onBack: () => void;
  onSubmit: () => void;
};

export default function Step7Review({
  form,
  onBack,
  onSubmit,
}: Step7ReviewProps) {
  return (
    <div className="space-y-6 text-white">
      <h2 className="text-sm lg:text-xl text-center font-bold ">
        Review Your Custom Storage
      </h2>

      <div className="space-y-3 text-sm border border-white/20 p-4 rounded-md bg-white/5">
        {/* Dimensions */}
        <div>
          <h3 className="font-semibold">Dimensions</h3>
          <p>
            {form.dimensions.length} ft (L) x {form.dimensions.width} ft (W) x{' '}
            {form.dimensions.height} ft (H)
          </p>
        </div>

        {/* Material */}
        {form.material && (
          <div>
            <h3 className="font-semibold">Material</h3>
            <p>{form.material}</p>
          </div>
        )}

        {/* Windows */}
        {form.windows?.hasWindows && (
          <div>
            <h3 className="font-semibold">Windows</h3>
            <p>{form.windows.quantity} window(s)</p>
          </div>
        )}

        {/* Doors */}
        {form.doors && (
          <div>
            <h3 className="font-semibold">Doors</h3>
            <p>{form.doors.count} door(s)</p>
          </div>
        )}

        {/* Roof */}
        {form.roof && (
          <div>
            <h3 className="font-semibold">Roof</h3>
            <p>{form.roof.style}</p>
          </div>
        )}

        {/* Addons */}
        {form.addons && form.addons.length > 0 && (
          <div>
            <h3 className="font-semibold">Add-ons</h3>
            <ul className="list-disc pl-4">
              {form.addons.map((addon) => (
                <li key={addon}>{addon}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-gray-700 text-white"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-green text-white"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
