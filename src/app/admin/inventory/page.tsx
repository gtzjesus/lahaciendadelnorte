'use client';

import { useEffect, useState } from 'react';

type Product = {
  _id?: string;
  itemNumber: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    itemNumber: '',
    name: '',
    slug: '',
    price: 0,
    stock: 0,
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'stock') {
      setForm((p) => ({ ...p, [name]: Number(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleUpload = async () => {
    if (!form.itemNumber || !form.name || !form.slug) {
      return alert('Item Number, Name & Slug are required');
    }

    const data = new FormData();
    data.append('itemNumber', form.itemNumber);
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('price', form.price.toString());
    data.append('stock', form.stock.toString());

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
        setForm({ itemNumber: '', name: '', slug: '', price: 0, stock: 0 });
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
      <h1 className="uppercase text-xl font-semibold mb-6">firework manager</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['itemNumber', 'name', 'slug', 'price', 'stock'].map((key) => (
          <input
            key={key}
            name={key}
            type={key === 'price' || key === 'stock' ? 'number' : 'text'}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={(form as any)[key]}
            onChange={handleChange}
            className="border border-flag-red p-3"
          />
        ))}
      </div>

      <div className="uppercase text-sm font-semibold mb-2">
        <label>Main Image:</label>
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
        <label>Extra Images (1–4):</label>
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

      <button
        disabled={loading}
        onClick={handleUpload}
        className="bg-flag-blue text-white uppercase px-6 py-3 font-light"
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
          <li key={p._id} className="border p-3 rounded">
            {p.name} ({p.itemNumber}) — ${p.price} — stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
