'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { client } from '@/sanity/lib/client';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  // Load products from Sanity
  useEffect(() => {
    client
      .fetch<Product[]>(`*[_type == "product"]{_id, name, slug, price}`)
      .then(setProducts)
      .catch(console.error);
  }, []);

  const startScanner = () => {
    if (scanner) return;
    const newScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );
    newScanner.render(
      (decodedText) => {
        console.log('Decoded:', decodedText);
        const code = decodedText.trim().toLowerCase();
        const matched = products.find((p) => p.slug.current === code);
        if (matched) setCart((prev) => [...prev, matched]);
        else alert(`No product matches "${code}"`);
      },
      (err) => console.warn('QR error:', err)
    );
    setScanner(newScanner);
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="p-4 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-4">ElPasoKaboom POS 💥</h1>

      <button
        onClick={startScanner}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        📷 Start Scanner
      </button>

      <div id="reader" className="w-full max-w-md mx-auto mt-4"></div>

      <div className="mt-6 space-y-2">
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between border-b pb-2">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-lg">
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Tax (8.25%): ${tax.toFixed(2)}</div>
        <div className="font-bold">Total: ${total.toFixed(2)}</div>
      </div>

      <button
        onClick={clearCart}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        🗑️ Clear Cart
      </button>
    </div>
  );
}
