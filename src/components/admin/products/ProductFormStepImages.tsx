'use client';

import React from 'react';
import type { AddProductDrawerProps as FormProps } from '@/types/admin/inventory';

interface ProductFormStepImagesProps extends FormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProductFormStepImages({
  mainImageFile,
  setMainImageFileAction,
  extraImageFiles,
  setExtraImageFilesAction,
  mainImageRef,
  extraImagesRef,
  onNext,
  onBack,
  loading,
  isFormValidAction,
  message,
}: ProductFormStepImagesProps) {
  // handle extra images change with max 4 limit
  const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      alert('Only up to 4 extra images allowed.');
      return;
    }
    setExtraImageFilesAction(files);
  };

  return (
    <>
      <div className=" p-4 mb-6 space-y-4 font-bold">
        <p className="text-xs text-center font-bold dark:text-flag-red">
          Add images to continue
        </p>
        {/* Main Image Upload */}
        <div className="flex flex-col gap-5 w-full mt-4">
          <button
            type="button"
            onClick={() => mainImageRef.current?.click()}
            className="w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm bg-flag-blue"
          >
            Upload Main Image
          </button>
          <input
            ref={mainImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setMainImageFileAction(e.target.files?.[0] || null)
            }
          />
          {mainImageFile && (
            <p className="mt-2 text-xs text-black dark:text-flag-red">
              <strong>{mainImageFile.name}</strong>
            </p>
          )}

          <button
            type="button"
            onClick={() => extraImagesRef.current?.click()}
            className="w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm bg-flag-blue"
          >
            Upload Extra Images
          </button>
          <input
            ref={extraImagesRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleExtraImagesChange}
          />
        </div>
        {extraImageFiles.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-xs text-black space-y-1">
            {extraImageFiles.map((file, i) => (
              <li key={i}>
                <strong>{file.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="uppercase w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm bg-gray-400 text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={loading || !isFormValidAction()}
          className={`uppercase w-full py-2 rounded-full text-xs font-semibold transition duration-200 ease-in-out shadow-sm ${
            loading || !isFormValidAction()
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green text-white'
          }`}
        >
          {loading ? 'Uploading...' : 'Review'}
        </button>
      </div>

      {message && <p className="mt-4 text-xs text-white">{message}</p>}
    </>
  );
}
