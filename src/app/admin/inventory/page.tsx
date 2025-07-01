'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
};

type Variant = {
  size: string;
  flavor: string;
  price: string; // keep as string for input ease, convert before sending
  stock: string;
};

type Product = {
  _id?: string;
  itemNumber: string;
  name: string;
  slug?: string;
  stock: number;
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
    variants: [{ size: '', flavor: '', price: '', stock: '' }] as Variant[],
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

    // Validate variants (no empty required fields)
    for (const v of form.variants) {
      if (!v.size || !v.flavor || !v.price || !v.stock) {
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
    data.append('stock', form.stock);
    data.append('categoryId', selectedCategory);

    // Convert variants price and stock to numbers before sending
    const variantsToSend = form.variants.map((v) => ({
      size: v.size,
      flavor: v.flavor,
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
          stock: '',
          variants: [{ size: '', flavor: '', price: '', stock: '' }],
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

  // Options for size and flavors (keep in sync with schema)
  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];
  const flavorOptions = [
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
  ];

  return (
    <div className="relative min-h-screen bg-white p-3">
      <h1 className="uppercase text-xl font-semibold mb-6">
        inventory manager
      </h1>

      <div className="flex flex-col">
        <h1 className="uppercase text-sm font-semibold mb-2">add product</h1>
        <button
          className="text-xs uppercase font-light mb-2 text-white bg-flag-blue px-3 py-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Hide fields' : 'Show fields to Add Product'}
        </button>
      </div>

      {showForm && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {['itemNumber', 'name', 'slug', 'stock'].map((key) => (
              <input
                key={key}
                name={key}
                type={key === 'stock' ? 'number' : 'text'}
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

            {/* Variants */}
            <div>
              <label className="block uppercase text-sm mb-1 font-semibold">
                Variants (size, flavor, price, stock)
              </label>
              {form.variants.map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 mb-2"
                >
                  {/* Size */}
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].size = e.target.value;
                      setForm({ ...form, variants });
                    }}
                    className="border p-2 text-sm uppercase"
                  >
                    <option value="">Size</option>
                    {sizeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Flavor */}
                  <select
                    value={v.flavor}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].flavor = e.target.value;
                      setForm({ ...form, variants });
                    }}
                    className="border p-2 text-sm capitalize"
                  >
                    <option value="">Flavor</option>
                    {flavorOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Price */}
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="border p-2 text-sm"
                    value={v.price}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].price = e.target.value;
                      setForm({ ...form, variants });
                    }}
                  />

                  {/* Stock */}
                  <input
                    type="number"
                    placeholder="Stock"
                    className="border p-2 text-sm"
                    value={v.stock}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[i].stock = e.target.value;
                      setForm({ ...form, variants });
                    }}
                  />

                  {/* Remove variant */}
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          variants: form.variants.filter((_, idx) => idx !== i),
                        });
                      }}
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
                      { size: '', flavor: '', price: '', stock: '' },
                    ],
                  })
                }
                className="text-xs underline"
              >
                + Add variant
              </button>
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
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          {message && <p className="mt-4">{message}</p>}
        </>
      )}

      <hr className="my-8" />
      <h2 className="uppercase text-xl font-semibold mb-6">
        product inventory
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
