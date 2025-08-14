import type { SanitySlug } from '@/types/index';
import type React from 'react';

export interface Variant {
  size: string;
  price: string;
  stock: string;
}

export interface AdminCategory {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface AdminProduct {
  _id: string;
  itemNumber: string;
  name: string;
  slug: SanitySlug;
  imageUrl?: string;
  extraImageUrls?: string[];
  category?: AdminCategory;
  variants: Variant[];
}

export interface AdminProductForm {
  itemNumber: string;
  name: string;
  slug: string;
  variants: Variant[];
}

export interface AddProductDrawerProps {
  form: AdminProductForm;
  setFormAction: React.Dispatch<React.SetStateAction<AdminProductForm>>;
  categories: AdminCategory[];
  selectedCategory: string;
  setSelectedCategoryAction: React.Dispatch<React.SetStateAction<string>>;
  mainImageFile: File | null;
  setMainImageFileAction: React.Dispatch<React.SetStateAction<File | null>>;
  extraImageFiles: File[];
  setExtraImageFilesAction: React.Dispatch<React.SetStateAction<File[]>>;
  mainImageRef: React.RefObject<HTMLInputElement>;
  extraImagesRef: React.RefObject<HTMLInputElement>;
  handleUploadAction: () => Promise<void>;
  loading: boolean;
  message: string;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isDuplicateSlugOrNameAction: () => boolean;
  isFormValidAction: () => boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
