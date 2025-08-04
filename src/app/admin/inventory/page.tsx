'use client';

import { useEffect, useRef, useState } from 'react';
import ProductForm from '@/components/admin/inventory/ProductForm';
import ProductList from '@/components/admin/inventory/ProductList';

import { slugify } from '@/utils/slugify';
import { isDuplicateSlugOrName } from '@/utils/validate';
import type {
  AdminCategory,
  AdminProduct,
  Variant,
} from '@/types/admin/inventory';
import {
  fetchAdminCategories,
  fetchAdminProducts,
  uploadAdminProduct,
} from '@/app/services/admin/inventory/inventoryService';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    itemNumber: '',
    name: '',
    slug: '',
    variants: [{ size: '', price: '', stock: '' }] as Variant[],
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const extraImagesRef = useRef<HTMLInputElement | null>(null);

  // Generate slug on name change
  useEffect(() => {
    const newSlug = slugify(form.name);
    setForm((prev) => ({ ...prev, slug: newSlug }));
  }, [form.name]);

  // Fetch categories
  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch((err) => {
        console.error('[Categories Fetch Error]', err);
        setCategories([]);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    fetchAdminProducts()
      .then(setProducts)
      .catch((err) => {
        console.error('[Products Fetch Error]', err);
        setProducts([]);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory
      ? p.category?._id === selectedCategory
      : true;
    return nameMatch && categoryMatch;
  });

  const isFormValid = () => {
    const { name, itemNumber, variants } = form;
    if (!name.trim() || !itemNumber.trim() || !selectedCategory) return false;
    if (variants.length === 0) return false;
    if (variants.some((v) => !v.size || !v.price || !v.stock)) return false;
    if (!mainImageFile) return false;
    if (isDuplicateSlugOrName(products, form.slug, form.name)) return false;
    return true;
  };

  const handleUpload = async () => {
    if (!isFormValid()) {
      setMessage('Please fill all fields correctly and avoid duplicates.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await uploadAdminProduct({
        itemNumber: form.itemNumber,
        name: form.name,
        slug: form.slug,
        category: selectedCategory,
        variants: form.variants,
        mainImage: mainImageFile!,
        extraImages: extraImageFiles,
      });

      // 🔁 Re-fetch instead of appending
      const refreshedProducts = await fetchAdminProducts();
      setProducts(refreshedProducts);
      setSearchTerm('');
      setSelectedCategory('');

      // Reset form
      setForm({
        itemNumber: '',
        name: '',
        slug: '',
        variants: [{ size: '', price: '', stock: '' }],
      });
      setMainImageFile(null);
      setExtraImageFiles([]);
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (extraImagesRef.current) extraImagesRef.current.value = '';

      setMessage('✅ Product added successfully!');
      setShowForm(false);
    } catch (err) {
      console.error('[Upload Error]', err);
      setMessage('❌ Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-2 pb-20">
      <div className="sticky top-12  z-10 p-4  flex flex-col  gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="uppercase border border-black text-black p-3 w-full md:w-auto flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className=" bg-white z-50 p-4  flex flex-col  gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-flag-red text-black font-semibold uppercase px-4 py-3 w-full md:w-auto"
        >
          {showForm ? 'Hide ' : 'Add New item'}
        </button>
      </div>
      <ProductForm
        form={form}
        setFormAction={setForm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategoryAction={setSelectedCategory}
        mainImageFile={mainImageFile}
        setMainImageFileAction={setMainImageFile}
        extraImageFiles={extraImageFiles}
        setExtraImageFilesAction={setExtraImageFiles}
        mainImageRef={mainImageRef}
        extraImagesRef={extraImagesRef}
        handleUploadAction={handleUpload}
        loading={loading}
        message={message}
        showForm={showForm}
        setShowForm={setShowForm}
        isDuplicateSlugOrNameAction={() =>
          isDuplicateSlugOrName(products, form.slug, form.name)
        }
        isFormValidAction={isFormValid}
      />

      <ProductList products={filteredProducts} />
    </main>
  );
}
