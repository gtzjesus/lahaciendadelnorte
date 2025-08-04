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
import { uploadAdminProduct } from '@/app/services/admin/inventory/inventoryService';

type Props = {
  initialProducts: AdminProduct[];
  initialCategories: AdminCategory[];
};

export default function InventoryClient({
  initialProducts,
  initialCategories,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [categories] = useState<AdminCategory[]>(initialCategories);
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

  useEffect(() => {
    const newSlug = slugify(form.name);
    setForm((prev) => ({ ...prev, slug: newSlug }));
  }, [form.name]);

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
      const newProduct = await uploadAdminProduct({
        itemNumber: form.itemNumber,
        name: form.name,
        slug: form.slug,
        category: selectedCategory,
        variants: form.variants,
        mainImage: mainImageFile!,
        extraImages: extraImageFiles,
      });

      setProducts((prev) => [...prev, newProduct]);

      // Reset form
      setForm({
        itemNumber: '',
        name: '',
        slug: '',
        variants: [{ size: '', price: '', stock: '' }],
      });
      setSelectedCategory('');
      setMainImageFile(null);
      setExtraImageFiles([]);
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (extraImagesRef.current) extraImagesRef.current.value = '';
      setMessage('Product added successfully!');
      setShowForm(false);
    } catch (err) {
      console.error('[Upload Error]', err);
      setMessage('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-2 pb-20">
      <div className="flex justify-between items-center mt-8 mb-6 gap-2">
        <input
          type="text"
          placeholder="Search products..."
          className="uppercase border border-black text-black p-3 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-flag-red text-black font-semibold uppercase px-4 py-3"
        >
          {showForm ? 'Close Form' : 'Add New Product'}
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
