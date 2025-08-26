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
      <p className="text-md lg:text-xl text-center font-bold ">
        Review your storage build and send it our way!
      </p>

      <div className="space-y-4 text-md border text-center border-flag-red p-2  bg-flag-red/20">
        {/* Dimensions */}
        <div>
          <h3 className="font-bold text-lg text-flag-red">Dimensions</h3>
          <p>Length: {form.dimensions.length}ft</p>
          <p>Width: {form.dimensions.width}ft</p>
          <p>Height: {form.dimensions.height}ft</p>
        </div>

        {/* Material */}
        {form.material && (
          <div>
            <h3 className="font-bold text-lg text-flag-red">Material</h3>
            <p className="uppercase">{form.material}</p>
          </div>
        )}

        {/* Windows */}
        {form.windows?.hasWindows && (
          <div>
            <h3 className="font-bold text-lg text-flag-red">Windows</h3>
            <p className="uppercase">{form.windows.quantity} window(s)</p>
          </div>
        )}

        {/* Doors */}
        {form.doors && (
          <div>
            <h3 className="font-bold text-lg text-flag-red">Doors</h3>
            <p className="uppercase">{form.doors.count} door(s)</p>
          </div>
        )}

        {/* Roof */}
        {form.roof && (
          <div>
            <h3 className="font-bold text-lg text-flag-red">Roof</h3>
            <p className="uppercase">{form.roof.style}</p>
          </div>
        )}

        {/* Addons */}
        {form.addons && form.addons.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-flag-red">Add-ons</h3>
            <ul className="uppercase">
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
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-gray-500 text-white"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="w-1/2 py-2 rounded-full text-xs font-semibold uppercase bg-flag-red text-black"
        >
          Submit Build
        </button>
      </div>
    </div>
  );
}
