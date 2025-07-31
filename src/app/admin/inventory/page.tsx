'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/* eslint-disable  @typescript-eslint/no-explicit-any */
type Category = {
  _id: string;
  title: string;
  slug: { current: string };
};

type Variant = {
  size: string;
  price: string;
  stock: string;
};

type Product = {
  _id?: string;
  itemNumber: string;
  name: string;
  slug?: { current: string };
  category?: Category;
  imageUrl?: string;
  extraImageUrls?: string[];
  variants?: Variant[];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    setForm((p) => ({ ...p, slug: newSlug }));
  }, [form.name]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        setProducts(allProducts);

        const maxItemNumber = allProducts.reduce((max: number, p: Product) => {
          const num = parseInt(p.itemNumber, 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);

        setForm((prev) => ({
          ...prev,
          itemNumber: String(maxItemNumber + 1),
        }));
      });

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const handleUpload = async () => {
    if (isDuplicateSlugOrName()) {
      return alert('PRODUCT WITH THIS NAME ALREADY EXISTS');
    }

    if (!form.itemNumber || !form.name || !form.slug || !selectedCategory) {
      return alert('PLEASE FILL OUT ALL FIELDS!');
    }

    if (!mainImageFile) {
      return alert('Main image is required!');
    }

    for (const v of form.variants) {
      if (!v.size || !v.price || !v.stock) {
        return alert('Please fill out all variant fields.');
      }
      if (isNaN(Number(v.price)) || Number(v.price) < 0) {
        return alert('Please enter a valid price >= 0 for each variant.');
      }
      if (isNaN(Number(v.stock)) || Number(v.stock) < 0) {
        return alert('Please enter a valid stock >= 0 for each variant.');
      }
    }

    const data = new FormData();
    data.append('itemNumber', form.itemNumber);
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('categoryId', selectedCategory);

    const variantsToSend = form.variants.map((v) => ({
      size: v.size,
      price: Number(v.price),
      stock: Number(v.stock),
    }));

    data.append('variants', JSON.stringify(variantsToSend));

    if (mainImageFile) {
      data.append('mainImage', mainImageFile);
    }
    extraImageFiles.forEach((file) => data.append('extraImages', file));

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/inventory', { method: 'POST', body: data });
      const result = await res.json();

      if (res.ok) {
        setMessage('NEW PRODUCT ADDED!');

        fetch('/api/products')
          .then((r) => r.json())
          .then((d) => {
            const updatedProducts = d.products || [];
            setProducts(updatedProducts);

            const nextItemNumber = String(
              Math.max(
                ...updatedProducts.map(
                  (p: Product) => parseInt(p.itemNumber, 10) || 0
                ),
                0
              ) + 1
            );

            setForm({
              itemNumber: nextItemNumber,
              name: '',
              slug: '',
              variants: [{ size: '', price: '', stock: '' }],
            });

            setSelectedCategory('');
            setMainImageFile(null);
            setExtraImageFiles([]);
            if (mainImageRef.current) mainImageRef.current.value = '';
            if (extraImagesRef.current) extraImagesRef.current.value = '';
          });
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (
      !form.itemNumber ||
      !form.name.trim() ||
      !form.slug ||
      !selectedCategory ||
      !mainImageFile
    ) {
      return false;
    }

    for (const v of form.variants) {
      if (!v.size || !v.price || !v.stock) return false;
      if (isNaN(Number(v.price)) || Number(v.price) < 0) return false;
      if (isNaN(Number(v.stock)) || Number(v.stock) < 0) return false;
    }

    return true;
  };
  const isDuplicateSlugOrName = () => {
    const currentSlug = slugify(form.name);
    return products.some(
      (p) =>
        p.name.toLowerCase().trim() === form.name.toLowerCase().trim() ||
        p.slug?.current?.toLowerCase().trim() === currentSlug
    );
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesItemNumber = p.itemNumber.toLowerCase().includes(term);
    const matchesName = p.name.toLowerCase().includes(term);
    return matchesItemNumber || matchesName;
  });

  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

  const availableSizeOptions = sizeOptions.filter(
    (size) => !form.variants.some((v) => v.size === size)
  );

  return (
    <div className="relative min-h-screen bg-white p-1 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold uppercase m-4">Inventory</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search product by name or number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="uppercase text-sm border border-black px-2 py-2 w-full sm:w-64"
        />
        <button
          className="text-sm uppercase font-light text-black bg-flag-red px-2 py-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Hide fields' : 'Add New Product'}
        </button>
      </div>

      <div className="px-4">
        {showForm && (
          <>
            <div className="grid grid-cols-1 gap-4 text-black mb-6">
              <input
                name="itemNumber"
                type="text"
                placeholder="Product number"
                value={form.itemNumber}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, itemNumber: e.target.value }))
                }
                className="uppercase text-sm border border-black p-3"
              />

              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="uppercase text-sm border border-black p-3"
              />
              {isDuplicateSlugOrName() && form.name.trim() && (
                <p className="text-sm text-red-600">
                  PRODUCT WITH THIS NAME ALREADY EXISTS
                </p>
              )}

              <div className="relative">
                <select
                  className="appearance-none uppercase text-sm border border-black p-3 pr-8 w-full bg-white text-black rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black">
                  ▼
                </div>
              </div>

              <div>
                {form.variants.map((v, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[80px_80px_80px_auto] gap-2 mb-2"
                  >
                    <div className="relative">
                      <select
                        value={v.size}
                        onChange={(e) => {
                          const variants = [...form.variants];
                          variants[i].size = e.target.value;
                          setForm({ ...form, variants });
                        }}
                        className="appearance-none border border-black p-1 pr-6 text-sm uppercase w-full bg-white rounded"
                      >
                        <option value="">Size</option>
                        {sizeOptions
                          .filter(
                            (opt) =>
                              !form.variants.some(
                                (v, j) => v.size === opt && j !== i
                              )
                          )
                          .map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs">
                        ▼
                      </div>
                    </div>

                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="uppercase border border-black p-1 text-sm w-full"
                      value={v.price}
                      onChange={(e) => {
                        const variants = [...form.variants];
                        variants[i].price = e.target.value;
                        setForm({ ...form, variants });
                      }}
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      className="border border-black uppercase p-1 text-sm w-full"
                      value={v.stock}
                      onChange={(e) => {
                        const variants = [...form.variants];
                        variants[i].stock = e.target.value;
                        setForm({ ...form, variants });
                      }}
                    />

                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            variants: form.variants.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                        className="text-red-600 font-bold text-xl px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      variants: [
                        ...form.variants,
                        { size: '', price: '', stock: '' },
                      ],
                    })
                  }
                  disabled={availableSizeOptions.length === 0}
                  className={`text-sm uppercase font-light mb-2 px-2 py-2 ${
                    availableSizeOptions.length === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-flag-blue text-black'
                  }`}
                >
                  + Add new size
                </button>
              </div>
            </div>

            <div className="border border-black p-4 mb-6 space-y-4">
              {/* Main Image Upload */}
              <div>
                <label className="block text-sm uppercase font-light text-black mb-1">
                  Add main image
                </label>
                <button
                  type="button"
                  onClick={() => mainImageRef.current?.click()}
                  className="bg-flag-blue text-black text-sm uppercase px-2 py-2 rounded "
                >
                  Upload Main Image
                </button>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setMainImageFile(e.target.files?.[0] || null)
                  }
                />
                {mainImageFile && (
                  <p className="mt-2 text-sm text-black">
                    Selected: <strong>{mainImageFile.name}</strong>
                  </p>
                )}
              </div>

              {/* Extra Images Upload */}
              <div>
                <label className="block text-sm uppercase font-light text-black mb-1">
                  Add extra images (up to 4 more)
                </label>
                <button
                  type="button"
                  onClick={() => extraImagesRef.current?.click()}
                  className="bg-flag-blue text-black text-sm uppercase px-2 py-2 rounded "
                >
                  Upload Extra Images
                </button>
                <input
                  ref={extraImagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 4)
                      return alert('Only up to 4 extra images allowed.');
                    setExtraImageFiles(files);
                  }}
                />
                {extraImageFiles.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-black space-y-1">
                    {extraImageFiles.map((file, i) => (
                      <li key={i}>
                        <strong>{file.name}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              disabled={loading || !isFormValid()}
              onClick={handleUpload}
              className={`text-sm uppercase font-light mb-2 px-2 py-2 ${
                loading || !isFormValid()
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-flag-red text-black'
              }`}
            >
              {loading ? 'Adding product...' : 'Add Product'}
            </button>

            {message && <p className="mt-4">{message}</p>}
          </>
        )}
      </div>

      <hr className="my-8 mx-4 border-black" />
      {filteredProducts.length === 0 ? (
        <p className="text-center text-sm uppercase text-black font-medium mt-6">
          No products found. try again
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {filteredProducts.map((p) => (
            <Link
              key={p._id}
              href={`/admin/inventory/${p.itemNumber}`}
              className="flex flex-col border border-black bg-flag-red text-black transition px-4 py-4"
            >
              {/* Product Image */}
              {p.imageUrl && (
                <div className="w-full h-40 relative mb-2">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="flex flex-col justify-center items-center uppercase text-xs">
                <p>#{p.itemNumber}</p>
                <p className="font-semibold">{p.name}</p>
              </div>

              {/* Category */}
              {p.category?.title && (
                <p className="text-xs text-center uppercase">
                  <span className="font-semibold">{p.category.title}</span>
                </p>
              )}

              {/* Total Stock */}
              {(p.variants ?? []).length > 0 && (
                <p className="text-xs uppercase text-center mb-1">
                  stock:{' '}
                  <span className="font-semibold">
                    {(p.variants ?? []).reduce(
                      (sum, v) => sum + Number(v.stock || 0),
                      0
                    )}
                  </span>
                </p>
              )}

              {/* Variants List */}
              {(p.variants ?? []).length > 0 && (
                <div className="uppercase mt-2 border-t border-black pt-2">
                  <ul className="text-xs space-y-1">
                    {(p.variants ?? []).map((v, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{v.size}</span>
                        <span>
                          ${parseFloat(v.price || '0').toFixed(2)} – {v.stock}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
