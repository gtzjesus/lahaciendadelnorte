'use client';

import { useEffect, useState } from 'react';
import type { AddProductDrawerProps } from '@/types/admin/inventory';
import LoaderOrder from '../common/LoaderOrder';
import ProductFormStepBasic from '../products/ProductFormStepBasic';
import ProductFormStepVariants from '../products/ProductFormStepVariants';
import ProductFormStepImages from '../products/ProductFormStepImages';
import ProductFormStepSubmit from '../products/ProductFormStepSubmit';

// Import your step components instead of ProductForm

export default function AddProductDrawer({
  form,
  setFormAction,
  categories,
  selectedCategory,
  setSelectedCategoryAction,
  mainImageFile,
  setMainImageFileAction,
  extraImageFiles,
  setExtraImageFilesAction,
  mainImageRef,
  extraImagesRef,
  handleUploadAction,
  loading,
  message,
  setShowForm,
  showForm,

  isDuplicateSlugOrNameAction,
  isFormValidAction,
  isExpanded,
  setIsExpanded,
}: AddProductDrawerProps) {
  // Manage current step internally here (optional: can lift state if you want)
  const [currentStep, setCurrentStep] = useState(1);

  // Reset step when drawer closes
  useEffect(() => {
    if (!isExpanded) setCurrentStep(1);
  }, [isExpanded]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Step components rendering
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductFormStepBasic
            form={form}
            setFormAction={setFormAction}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategoryAction={setSelectedCategoryAction}
            isDuplicateSlugOrNameAction={isDuplicateSlugOrNameAction}
            onNext={() => setCurrentStep(2)}
          />
        );

      case 2:
        return (
          <ProductFormStepVariants
            form={form}
            setFormAction={setFormAction}
            onNext={() => setCurrentStep(currentStep + 1)}
            onBack={() => setCurrentStep(currentStep - 1)}
          />
        );
      case 3:
        return (
          <ProductFormStepImages
            form={form}
            setFormAction={setFormAction}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategoryAction={setSelectedCategoryAction}
            mainImageFile={mainImageFile}
            setMainImageFileAction={setMainImageFileAction}
            extraImageFiles={extraImageFiles}
            setExtraImageFilesAction={setExtraImageFilesAction}
            mainImageRef={mainImageRef}
            extraImagesRef={extraImagesRef}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            loading={loading}
            isFormValidAction={isFormValidAction}
            message={message}
            // REMOVE showForm and setShowForm here if not needed
            isDuplicateSlugOrNameAction={isDuplicateSlugOrNameAction} // only if used inside
            handleUploadAction={handleUploadAction} // only if used inside
            isExpanded={isExpanded} // only if used inside
            setIsExpanded={setIsExpanded} // only if used inside
            showForm={showForm} // add this
            setShowForm={setShowForm}
          />
        );

      case 4:
        return (
          <ProductFormStepSubmit
            form={form}
            handleUploadAction={handleUploadAction}
            loading={loading}
            message={message}
            isFormValidAction={isFormValidAction}
            onBack={() => setCurrentStep(3)}
            mainImageFile={mainImageFile}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-30 w-full max-w-xl md:max-w-4xl mx-auto
        transition-all duration-700 ease-in-out 
            ${isExpanded ? 'h-[80dvh]' : 'h-[50px]'}
        rounded-t-2xl shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat z-40
      `}
      style={{ backgroundImage: "url('/admin/adding.webp')" }}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 bg-flag-red bg-opacity-80 flex justify-center items-center">
          <LoaderOrder />
        </div>
      )}

      {/* Drag handle */}
      {!isExpanded && (
        <div className="w-10 h-1 bg-black bg-opacity-30 mx-auto my-2"></div>
      )}
      {!isExpanded && (
        <div className="flex justify-between mx-4 text-xs font-bold text-center text-black ">
          <h3 className="mb-2 mt-1">add new item</h3>
          <h3 className="mb-2 mt-1">tap here</h3>
        </div>
      )}

      {/* Collapse Button */}
      {isExpanded && (
        <div className="flex justify-center mt-2 mb-1 text-black ">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
              setShowForm(false);
              setCurrentStep(1);
            }}
            className="text-white bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-5 mt-1"
          >
            Hide Form ↓
          </button>
        </div>
      )}

      {/* Product Form Content */}
      {isExpanded && (
        <div className="backdrop-blur-sm overflow-y-scroll px-4 h-full flex flex-col">
          {/* Step content */}
          <div className="flex-grow">{renderStep()}</div>

          {/* Step navigation buttons */}
        </div>
      )}
    </div>
  );
}
