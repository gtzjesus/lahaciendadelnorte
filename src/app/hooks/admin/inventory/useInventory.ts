'use client';

import { useState, useEffect, useRef } from 'react';
import { slugify } from '@/utils/slugify';
import { AdminCategory, AdminProduct } from '@/types/admin/inventory';

export function useInventory({
  initialProducts,
  categories,
}: {
  initialProducts: AdminProduct[];
  categories: AdminCategory[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [form, setForm] = useState({
    itemNumber: '',
    name: '',
    slug: '',
    variants: [{ size: '', price: '', stock: '' }],
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const extraImagesRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const newSlug = slugify(form.name);
    setForm((p) => ({ ...p, slug: newSlug }));
  }, [form.name]);

  useEffect(() => {
    const maxItemNumber = initialProducts.reduce(
      (max: number, p: AdminProduct) => {
        const num = parseInt(p.itemNumber, 10);
        return isNaN(num) ? max : Math.max(max, num);
      },
      0
    );

    const newItemNumber = String(maxItemNumber + 1);
    console.log('Auto-generated itemNumber:', newItemNumber); // <-- DEBUG

    setForm((prev) => ({
      ...prev,
      itemNumber: newItemNumber,
    }));
  }, [initialProducts]);

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.itemNumber.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    products,
    setProducts, // <-- This is the fix
    form,
    setForm,
    selectedCategory,
    setSelectedCategory,
    mainImageFile,
    setMainImageFile,
    extraImageFiles,
    setExtraImageFiles,
    loading,
    setLoading,
    message,
    setMessage,
    showForm,
    setShowForm,
    mainImageRef,
    extraImagesRef,
    filteredProducts,
    categories,
  };
}
