'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { client } from '@/sanity/lib/client';
import confetti from 'canvas-confetti';

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

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

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

          // Fire confetti for success!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

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
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl uppercase font-bold mb-4">point of sale</h1>

      <button
        onClick={startScanner}
        className="p-4 block uppercase text-xs z-[10] font-light text-center bg-flag-blue text-white "
      >
        start scanning
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
            <div className="flex items-center gap-4">
              <div className="font-semibold">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(i)}
                className="text-red-600 text-lg font-bold"
                aria-label="Remove item"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full lg:w-auto h-fit bg-flag-blue p-6 lg:p-12 bottom-0 left-0 lg:left-auto lg:bottom-0 lg:order-last shadow-md">
        <h3 className="uppercase text-xs font-light text-center text-white border-b pb-1">
          sale Summary
        </h3>

        <div></div>
        <div className="font-bold"></div>
        <div className="pt-1 space-y-1 mt-5 mb-5 gap-3">
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>Subtotal: ${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>
              <span className="lowercase">Tax (8.25%): ${tax.toFixed(2)}</span>:
            </span>
          </p>
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>Total: ${total.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="w-full text-sm bg-green border uppercase mb-5 py-2 text-white font-light hover:bg-opacity-90 transition"
        >
          Sale Total: ${total.toFixed(2)}
        </button>
        <button
          onClick={clearCart}
          className="w-full text-sm bg-flag-red border uppercase py-2 text-white font-light hover:bg-opacity-90 transition"
        >
          Clear Sale
        </button>
      </div>
    </div>
  );
}
