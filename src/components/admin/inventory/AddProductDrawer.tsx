'use client';

import { useEffect } from 'react';
import ProductForm from '@/components/admin/inventory/ProductForm';
import type { AddProductDrawerProps } from '@/types/admin/inventory';
import LoaderOrder from '../common/LoaderOrder';

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
  showForm,
  setShowForm,
  isDuplicateSlugOrNameAction,
  isFormValidAction,
  isExpanded,
  setIsExpanded,
}: AddProductDrawerProps) {
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

  // Always render container, tap toggles expansion
  return (
    <div
      className={`
    fixed bottom-0 left-0 right-0 z-30 w-full max-w-xl md:max-w-4xl mx-auto
    transition-all duration-700 ease-in-out 
    ${isExpanded ? 'h-[92.5dvh]' : 'h-[50px]'}
    rounded-t-2xl shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat 
  `}
      style={{ backgroundImage: "url('/admin/adding.webp')" }}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <LoaderOrder />
        </div>
      )}

      {/* Drag handle */}
      {!isExpanded && (
        <div className="w-10 h-1 bg-black bg-opacity-30   mx-auto my-2"></div>
      )}
      {!isExpanded && (
        <div className="flex justify-between mx-4 text-xs font-bold text-center text-white ">
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
            }}
            className="text-white bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-5"
          >
            Hide Form ↓
          </button>
        </div>
      )}

      {/* Product Form Content */}
      {isExpanded && (
        <div className=" backdrop-blur-sm overflow-y-scroll px-4 h-full pb-28">
          <ProductForm
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
            handleUploadAction={handleUploadAction}
            loading={loading}
            message={message}
            showForm={showForm}
            setShowForm={setShowForm}
            isDuplicateSlugOrNameAction={isDuplicateSlugOrNameAction}
            isFormValidAction={isFormValidAction}
          />
        </div>
      )}
    </div>
  );
}
