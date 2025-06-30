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
  price: number;
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

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    itemNumber: '',
    name: '',
    slug: '',
    price: '',
    stock: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleUpload = async () => {
    if (
      !form.itemNumber ||
      !form.name ||
      !form.slug ||
      form.price === '' ||
      form.stock === '' ||
      !selectedCategory
    ) {
      return alert('Please fill out all fields and select a category');
    }

    const data = new FormData();
    data.append('itemNumber', form.itemNumber);
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('price', form.price);
    data.append('stock', form.stock);
    data.append('categoryId', selectedCategory);

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
        setForm({ itemNumber: '', name: '', slug: '', price: '', stock: '' });
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
      /* eslint-disable  @typescript-eslint/no-explicit-any */
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

      {/* Toggle Form */}
      <div className="flex flex-col">
        <h1 className="uppercase text-sm font-semibold mb-2">add firework</h1>
        <button
          className="text-xs uppercase font-light mb-2 text-white bg-flag-blue px-3 py-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Hide fields' : 'Show fields to Add Firework'}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            {['itemNumber', 'name', 'slug', 'price', 'stock'].map((key) => (
              <input
                key={key}
                name={key}
                type={key === 'price' || key === 'stock' ? 'text' : 'text'}
                inputMode={
                  key === 'price' || key === 'stock' ? 'numeric' : 'text'
                }
                placeholder={
                  key === 'slug'
                    ? 'slug Auto-generated'
                    : key.charAt(0).toUpperCase() + key.slice(1)
                }
                value={(form as any)[key]}
                onChange={handleChange}
                readOnly={key === 'slug'}
                className={`uppercase text-sm border border-flag-red p-3 ${
                  key === 'slug' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            ))}

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="uppercase text-sm font-semibold block mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="uppercase text-sm border border-flag-red p-3 w-full"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Uploads */}
          <div className="border border-flag-red p-2">
            <div className="uppercase text-sm font-semibold mb-2">
              <label className="px-1">Main Image:</label>
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setMainImageFile(f);
                }}
              />
            </div>

            <div className="uppercase text-sm font-semibold mb-2">
              <label className="px-1">Other Images (1–4):</label>
              <input
                ref={extraImagesRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  if (files.length > 4)
                    return alert('Only up to 4 extra images allowed.');
                  setExtraImageFiles(files);
                }}
              />
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleUpload}
            className="bg-flag-blue mt-4 text-white uppercase px-6 py-3 font-light"
          >
            {loading ? 'Adding firework...' : 'Add firework'}
          </button>

          {message && <p className="mt-4">{message}</p>}
        </>
      )}

      {/* Product List */}
      <hr className="my-8" />
      <h2 className="uppercase text-xl font-semibold mb-6">
        firework inventory
      </h2>

      <ul className="space-y-2 ">
        {[...products]
          .sort((a, b) => Number(a.itemNumber) - Number(b.itemNumber))
          .map((p) => (
            <li key={p._id}>
              <Link
                href={`/admin/inventory/${p.itemNumber}`}
                className="uppercase border border-flag-blue bg-white p-2 shadow-sm hover:shadow-md transition flex gap-4 items-center"
              >
                {p.imageUrl && (
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 justify-between text-left">
                  <div className="flex gap-2 items-center">
                    <p className="text-sm text-gray-500">#{p.itemNumber}</p>
                    <p className="text-sm font-semibold text-flag-red">
                      {p.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 text-right">
                  <p className="text-sm text-green font-semibold">
                    ${p.price.toFixed(2)}
                  </p>
                  <p>
                    Stock: <span className="font-semibold ">{p.stock}</span>
                  </p>
                  {p.category && (
                    <p>
                      Category:{' '}
                      <span className="font-semibold">{p.category.title}</span>
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
