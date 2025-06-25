'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { client } from '@/sanity/lib/client';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  quantity?: number;
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
        const code = decodedText.trim().toLowerCase();
        const matched = products.find((p) => p.slug.current === code);

        if (!matched) {
          alert(`No product matches "${code}"`);
          return;
        }

        setCart((prevCart) => {
          const exists = prevCart.find((item) => item._id === matched._id);
          if (exists) return prevCart; // already in cart, skip

          return [...prevCart, { ...matched, quantity: 1 }];
        });
      },
      (err) => console.warn('QR error:', err)
    );

    setScanner(newScanner);
  };

  const updateQuantity = (index: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
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

      <div className="mt-6 space-y-4">
        {cart.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">
                ${item.price.toFixed(2)} x
                <select
                  className="ml-2 border rounded px-1 py-0.5"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(i, Number(e.target.value))}
                >
                  {[...Array(10)].map((_, n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="font-semibold">
              ${(item.price * (item.quantity || 1)).toFixed(2)}
            </div>
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
