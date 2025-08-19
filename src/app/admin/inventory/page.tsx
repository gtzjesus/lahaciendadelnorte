'use client';

import { useEffect, useRef, useState } from 'react';
import ProductList from '@/components/admin/inventory/ProductList';
import AddProductDrawer from '@/components/admin/inventory/AddProductDrawer';

import { slugify } from '@/utils/slugify';
import { isDuplicateSlugOrName } from '@/utils/validate';
import type {
  AdminCategory,
  AdminProduct,
  AdminProductForm,
} from '@/types/admin/inventory';

import {
  fetchAdminCategories,
  fetchAdminProducts,
  uploadAdminProduct,
} from '@/app/services/admin/inventory/inventoryService';

export default function InventoryPage() {
  const [isScrolled, setIsScrolled] = useState(false); // Track if the user has scrolled
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState<AdminProductForm>({
    itemNumber: '',
    name: '',
    slug: '',
    variants: [{ size: '', price: '', stock: '' }],
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    fetchAdminProducts()
      .then((data) => {
        setProducts(data);

        // ✅ Determine the next available item number
        const maxItemNumber = data.reduce((max, product) => {
          const num = parseInt(product.itemNumber, 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);

        // Set form with next available number
        setForm((prev) => ({
          ...prev,
          itemNumber: (maxItemNumber + 1).toString().padStart(4, '0'), // optional formatting
        }));
      })
      .catch((err) => {
        console.error('[Products Fetch Error]', err);
        setProducts([]);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    const lowerSearch = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(lowerSearch);
    const itemNumberMatch = p.itemNumber.toLowerCase().includes(lowerSearch);
    const categoryMatch = selectedCategory
      ? p.category?._id === selectedCategory
      : true;
    return (nameMatch || itemNumberMatch) && categoryMatch;
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

      // Re-fetch products after upload
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

      setShowForm(false);
      setIsExpanded(false);
    } catch (err) {
      console.error('[Upload Error]', err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // If scrolled more than 50px
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex flex-col  min-h-screen mx-auto max-w-4xl">
      <div className="max-w-4xl fixed w-full z-10 flex flex-col">
        <input
          type="text"
          placeholder="Search inventory by name or #"
          className={` text-center p-4 border-b border-red-300  text-sm focus:outline-none focus:ring-0 transition-all  ${
            isScrolled
              ? 'fixed border-none left-0 w-full bg-white  z-20' // Scroll down state
              : 'bg-transparent font-bold'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* AddProductDrawer always rendered */}
      <AddProductDrawer
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
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <div className="mt-20">
        <ProductList products={filteredProducts} />
      </div>
    </main>
  );
}
