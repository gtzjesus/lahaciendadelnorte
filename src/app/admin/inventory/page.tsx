'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Product = {
  _id?: string;
  itemNumber: string;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  extraImageUrls?: string[];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumerics
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // collapse multiple dashes

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const newSlug = slugify(form.name);
    setForm((p) => ({ ...p, slug: newSlug }));
  }, [form.name]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
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
      form.stock === ''
    ) {
      return alert('Please fill out all fields');
    }

    const data = new FormData();
    data.append('itemNumber', form.itemNumber);
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('price', form.price);
    data.append('stock', form.stock);

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
        setMainImageFile(null);
        setExtraImageFiles([]);
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

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <h1 className="uppercase text-sm font-semibold">add firework</h1>

        {['itemNumber', 'name', 'slug', 'price', 'stock'].map((key) => (
          <input
            key={key}
            name={key}
            type={key === 'price' || key === 'stock' ? 'text' : 'text'}
            inputMode={key === 'price' || key === 'stock' ? 'numeric' : 'text'}
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
      </div>
      <div className="border border-flag-red p-2">
        <div className="uppercase text-sm font-semibold mb-2">
          <label className="px-1">Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setMainImageFile(f);
            }}
          />
        </div>

        <div className="uppercase text-sm font-semibold mb-2">
          <label className='className="px-1'>other Images (1–4):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
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

      <hr className="my-8" />

      <h2 className="uppercase text-xl font-semibold mb-6">
        explosives inventory
      </h2>
      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p._id}
            className="border p-3 rounded flex items-center gap-4"
          >
            {p.imageUrl && (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="64px"
                  priority={false}
                />
              </div>
            )}
            <div>
              {p.name} ({p.itemNumber}) — ${p.price} — stock: {p.stock}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
