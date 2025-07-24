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
  slug?: string;
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
      .then((data) => setProducts(data.products || []));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const handleUpload = async () => {
    if (!form.itemNumber || !form.name || !form.slug || !selectedCategory) {
      return alert('Please fill out all required fields and select a category');
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
        setMessage('✅ Product added!');
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

        fetch('/api/products')
          .then((r) => r.json())
          .then((d) => setProducts(d.products || []));
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

  return (
    <div className="relative min-h-screen bg-white p-3 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold uppercase my-4">Inventory</h1>

      <div className="">
        <button
          className="text-sm uppercase font-light mb-2 text-black bg-flag-red px-2 py-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Hide fields' : 'add new product'}
        </button>
      </div>

      {showForm && (
        <>
          <div className="grid grid-cols-1 gap-4 text-black mb-6">
            {['product number', 'name', 'slug'].map((key) => (
              <input
                key={key}
                name={key}
                type="text"
                placeholder={key === 'slug' ? 'Slug (auto)' : key}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                readOnly={key === 'slug'}
                className="uppercase text-sm border  border-black p-3"
              />
            ))}

            <select
              className="uppercase text-sm border border-black p-3"
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

            <div>
              {form.variants.map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2"
                >
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].size = e.target.value;
                      setForm({ ...form, variants });
                    }}
                    className="border border-black p-2 text-sm uppercase"
                  >
                    <option value="">Size</option>
                    {sizeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="uppercase border border-black p-2 text-sm"
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
                    className="border border-black uppercase p-2 text-sm"
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
                          variants: form.variants.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-600 font-bold"
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
                className="text-sm uppercase font-light mb-2 text-black bg-flag-blue px-2 py-2"
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
                className="bg-flag-blue text-black text-xs uppercase px-2 py-2 rounded "
              >
                Upload Main Image
              </button>
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
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
                Add extra images
              </label>
              <button
                type="button"
                onClick={() => extraImagesRef.current?.click()}
                className="bg-flag-blue text-black text-xs uppercase px-2 py-2 rounded "
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
            disabled={loading}
            onClick={handleUpload}
            className="text-sm uppercase font-light mb-2 text-black bg-flag-red px-2 py-2"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          {message && <p className="mt-4">{message}</p>}
        </>
      )}

      <hr className="my-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...products].map((p) => (
          <Link
            key={p._id}
            href={`/admin/inventory/${p.itemNumber}`}
            className="flex flex-col border border-black bg-flag-red  transition"
          >
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
            <div>
              <p className="text-xs text-gray-200">#{p.itemNumber}</p>
              <p className="text-sm font-semibold text-white">{p.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
