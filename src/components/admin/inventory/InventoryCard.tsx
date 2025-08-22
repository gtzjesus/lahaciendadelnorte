'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface SizeOption {
  label: string;
  price: number | '';
  stock: number | '';
}

interface InventoryCardProps {
  product: any;
  allCategories: { _id: string; title: string }[];
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  product,
  allCategories,
}) => {
  const [name, setName] = useState(product.name || '');
  const [sizes, setSizes] = useState<SizeOption[]>(
    product.variants?.map((v: any) => ({
      label: v.size,
      price: v.price,
      stock: v.stock,
    })) || [{ label: '', price: '', stock: '' }]
  );
  const [categoryId, setCategoryId] = useState(product.category?._id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);

  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (mainImageFile) {
      setMainPreview(URL.createObjectURL(mainImageFile));
    }
  }, [mainImageFile]);

  useEffect(() => {
    setExtraPreviews(extraFiles.map((f) => URL.createObjectURL(f)));
  }, [extraFiles]);

  const onDropMain = (files: File[]) => {
    if (files[0]) setMainImageFile(files[0]);
  };
  const onDropExtra = (files: File[]) => {
    setExtraFiles(files.slice(0, 4));
  };

  const { getRootProps: gm, getInputProps: gi } = useDropzone({
    onDrop: onDropMain,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });
  const { getRootProps: gx, getInputProps: gix } = useDropzone({
    onDrop: onDropExtra,
    accept: { 'image/*': [] },
    maxFiles: 4,
  });

  // Validation function: returns true if all sizes are valid (no empty fields)
  const allSizesValid = sizes.every(
    (s) =>
      s.label.trim() !== '' &&
      s.price !== '' &&
      s.price !== null &&
      !isNaN(Number(s.price)) &&
      s.stock !== '' &&
      s.stock !== null &&
      !isNaN(Number(s.stock))
  );

  const handleSave = async () => {
    if (!allSizesValid) {
      alert(
        'Please fill out all size fields (label, price, stock) before saving.'
      );
      return;
    }
    setIsSaving(true);
    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append(
      'sizes',
      JSON.stringify(
        sizes.map((s) => ({
          size: s.label,
          price: typeof s.price === 'string' ? 0 : s.price,
          stock: typeof s.stock === 'string' ? 0 : s.stock,
        }))
      )
    );
    if (mainImageFile) formData.append('mainImage', mainImageFile);
    extraFiles.forEach((f) => formData.append('extraImages', f));

    const res = await fetch('/api/admin/update-product', {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Failed to save');
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch('/api/admin/delete-product', {
        method: 'DELETE',
        body: JSON.stringify({ productId: product._id }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/inventory');
      } else {
        throw new Error(data.error || 'Unknown error deleting product');
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-flag-red dark:bg-gray-800  border border-black border-opacity-5  shadow-lg p-6 space-y-6">
      {/* Main Image Upload */}
      <div
        {...gm()}
        className="mx-auto w-40 h-40 rounded-full  flex items-center justify-center cursor-pointer border-2 border-dashed  transition"
      >
        <input {...gi()} />
        {mainPreview || product.imageUrl ? (
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={mainPreview || product.imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <p className="text-gray-500">Upload main image</p>
        )}
      </div>

      {/* Name & Item # */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex mx-auto">
          <label className="block text-sm font-light uppercase "></label>
          <p className="text-sm dark:text-flag-red">
            {product.itemNumber || '—'}
          </p>
        </div>
        <div>
          <label className="block text-xs font-light uppercase mb-2 dark:text-flag-red">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="uppercase w-full border px-2 py-2 border-black border-opacity-5 text-xs focus:outline-flag-blue"
          />
        </div>
      </div>

      {/* Variants */}
      <div>
        <ul className="uppercase w-full px-2 py-2 text-xs focus:outline-flag-red-2">
          {sizes.map((s, i) => (
            <li
              key={i}
              className="flex border-black border-opacity-5 items-start sm:items-center gap-2 p-2 transition"
            >
              <div className="relative w-full max-w-[120px]">
                <p className="block text-xs font-light uppercase mb-2 dark:text-flag-red">
                  Size
                </p>
                <select
                  value={s.label}
                  onChange={(e) => {
                    const arr = [...sizes];
                    arr[i].label = e.target.value;
                    setSizes(arr);
                  }}
                  className="appearance-none border-black border-opacity-5 border uppercase p-2 pr-6 text-xs w-full bg-white rounded focus:outline-flag-blue"
                >
                  <option value="">Select size</option>
                  {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {/* <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black text-[10px]">
                  ▼
                </div> */}
              </div>
              <div className="flex flex-col">
                <p className="block text-xs font-light uppercase mb-2 dark:text-flag-red">
                  Price
                </p>

                <input
                  type="number"
                  step="0.01"
                  value={s.price === '' ? '' : s.price}
                  onChange={(e) => {
                    const arr = [...sizes];
                    const val = e.target.value;
                    arr[i].price = val === '' ? '' : parseFloat(val);
                    setSizes(arr);
                  }}
                  placeholder="Price"
                  className="w-24 border border-black border-opacity-5 p-2 text-xs focus:outline-flag-blue"
                />
              </div>
              <div className="flex flex-col">
                <p className="block text-xs font-light uppercase mb-2 dark:text-flag-red">
                  Stock
                </p>

                <input
                  type="number"
                  value={s.stock === '' ? '' : s.stock}
                  onChange={(e) => {
                    const arr = [...sizes];
                    const val = e.target.value;
                    arr[i].stock = val === '' ? '' : parseInt(val);
                    setSizes(arr);
                  }}
                  placeholder="Stock"
                  className="w-20 border  p-2 text-xs border-black border-opacity-5 focus:outline-flag-blue"
                />
              </div>

              {sizes.length > 1 && (
                <button
                  onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setSizes([...sizes, { label: '', price: '', stock: '' }])
          }
          className="w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm bg-flag-blue"
        >
          + Add Size
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="uppercase p-2 text-xs dark:text-flag-red">
          Category
        </label>
        <div className="relative w-full">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="appearance-none uppercase w-full border border-black border-opacity-5 px-2 py-2 pr-8 text-xs bg-white rounded mt-1"
          >
            <option value="">Select category</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black text-[12px]">
            ▼
          </div>
        </div>
      </div>

      {/* Extra Images Upload */}
      <div
        {...gx()}
        className="border border-black border-opacity-5 pt-2 transition cursor-pointer"
      >
        <input {...gix()} />
        <p className="text-center  text-xs dark:text-flag-red">
          Tap to add more images (up to 5)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {extraPreviews.map((url, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded overflow-hidden"
            >
              <Image
                src={url}
                alt={`extra ${idx}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSaving || !allSizesValid}
        className={clsx(
          'w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm ',
          isSaving || !allSizesValid
            ? 'bg-green text-white cursor-not-allowed'
            : 'bg-green text-white '
        )}
      >
        {isSaving ? 'Saving item' : 'Save Changes'}
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={clsx(
          'w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm',
          isDeleting
            ? 'bg-red-200 text-white cursor-not-allowed'
            : 'bg-red-500 text-white'
        )}
      >
        {isDeleting ? 'Deleting item...' : 'Delete item'}
      </button>

      {/* Save Feedback */}
      {saved && (
        <div className="uppercase text-sm fixed bottom-4 right-4 bg-flag-red text-black px-4 py-2 shadow-lg animate-pulse">
          ✔ item Updated!
        </div>
      )}
    </div>
  );
};

export default InventoryCard;
