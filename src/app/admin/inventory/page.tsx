'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
};

type Product = {
  _id?: string;
  itemNumber: string;
  name: string;
  slug?: string;
  price?: number;
  stock: number;
  category?: Category;
  imageUrl?: string;
  extraImageUrls?: string[];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
/* eslint-disable  @typescript-eslint/no-explicit-any */
export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    itemNumber: '',
    name: '',
    slug: '',
    stock: '',
    sizes: [{ label: '', price: '' }],
    flavors: [] as string[],
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
    if (
      !form.itemNumber ||
      !form.name ||
      !form.slug ||
      form.stock === '' ||
      !selectedCategory
    ) {
      return alert('Please fill out all required fields and select a category');
    }

    const data = new FormData();
    data.append('itemNumber', form.itemNumber);
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('stock', form.stock);
    data.append('categoryId', selectedCategory);
    data.append('sizes', JSON.stringify(form.sizes));
    data.append('flavors', JSON.stringify(form.flavors));

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
          stock: '',
          sizes: [{ label: '', price: '' }],
          flavors: [],
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

  return (
    <div className="relative min-h-screen bg-white p-3">
      <h1 className="uppercase text-xl font-semibold mb-6">
        inventory manager
      </h1>

      <div className="flex flex-col">
        <h1 className="uppercase text-sm font-semibold mb-2">add firework</h1>
        <button
          className="text-xs uppercase font-light mb-2 text-white bg-flag-blue px-3 py-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Hide fields' : 'Show fields to Add Firework'}
        </button>
      </div>

      {showForm && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {['itemNumber', 'name', 'slug', 'stock'].map((key) => (
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
                className="uppercase text-sm border border-flag-red p-3"
              />
            ))}

            {/* Category */}
            <select
              className="uppercase text-sm border border-flag-red p-3"
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

            {/* Sizes */}
            <div>
              <label className="block uppercase text-sm mb-1 font-semibold">
                Sizes & Prices
              </label>
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={s.label}
                    onChange={(e) => {
                      const sizes = [...form.sizes];
                      sizes[i].label = e.target.value;
                      setForm({ ...form, sizes });
                    }}
                    className="flex-1 border p-2 text-sm"
                  >
                    <option value="">Size</option>
                    {['Small', 'Medium', 'Large', 'XL'].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="w-24 border p-2 text-sm"
                    value={s.price}
                    onChange={(e) => {
                      const sizes = [...form.sizes];
                      sizes[i].price = e.target.value;
                      setForm({ ...form, sizes });
                    }}
                  />
                  {form.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          sizes: form.sizes.filter((_, idx) => idx !== i),
                        })
                      }
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
                    sizes: [...form.sizes, { label: '', price: '' }],
                  })
                }
                className="text-xs underline"
              >
                + Add size
              </button>
            </div>

            {/* Flavors */}
            <div>
              <label className="block uppercase text-sm mb-1 font-semibold">
                Flavors
              </label>
              <select
                multiple
                className="border p-2 text-sm w-full h-32"
                value={form.flavors}
                onChange={(e) =>
                  setForm({
                    ...form,
                    flavors: Array.from(
                      e.target.selectedOptions,
                      (o) => o.value
                    ),
                  })
                }
              >
                {[
                  'hawaiian delight',
                  'blue moon',
                  'chocolate',
                  'velvet rose',
                  'yellow rode',
                  'pink lady',
                  'creamy banana',
                  'tamarindo',
                  'mango',
                  'cantaloupe',
                  'natural lime',
                  'guava',
                  'mazapan',
                ].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="border border-flag-red p-2 mb-4">
            <input
              ref={mainImageRef}
              type="file"
              accept="image/*"
              onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
            />
            <input
              ref={extraImagesRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 4)
                  return alert('Only up to 4 extra images allowed.');
                setExtraImageFiles(files);
              }}
            />
          </div>

          <button
            disabled={loading}
            onClick={handleUpload}
            className="bg-flag-blue text-white uppercase px-6 py-3 font-light"
          >
            {loading ? 'Adding...' : 'Add Firework'}
          </button>
          {message && <p className="mt-4">{message}</p>}
        </>
      )}

      <hr className="my-8" />
      <h2 className="uppercase text-xl font-semibold mb-6">
        firework inventory
      </h2>

      <ul className="space-y-2">
        {[...products]
          .sort((a, b) => Number(a.itemNumber) - Number(b.itemNumber))
          .map((p) => (
            <li key={p._id}>
              <Link
                href={`/admin/inventory/${p.itemNumber}`}
                className="flex gap-4 items-center p-2 border border-flag-blue"
              >
                {p.imageUrl && (
                  <div className="w-20 h-20 relative">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">#{p.itemNumber}</p>
                  <p className="text-sm font-semibold">{p.name}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
