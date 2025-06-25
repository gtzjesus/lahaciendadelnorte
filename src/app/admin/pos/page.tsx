'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { client } from '@/sanity/lib/client';
import { Fireworks } from 'fireworks-js';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  quantity?: number; // <-- quantity from backend
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const fireworksContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client
      .fetch<
        Product[]
      >(`*[_type == "product"]{_id, name, slug, price, quantity}`)
      .then(setProducts)
      .catch(console.error);
  }, []);

  const launchFireworks = () => {
    if (!fireworksContainer.current) return;

    fireworksContainer.current.innerHTML = '';
    fireworksContainer.current.style.opacity = '1';

    const fireworks = new Fireworks(fireworksContainer.current, {
      opacity: 0.8,
      acceleration: 1.2,
      friction: 0.95,
      gravity: 1.5,
      explosion: 6,
      particles: 60,
      traceLength: 3,
      traceSpeed: 5,
      flickering: 15,
      lineStyle: 'round',
      hue: { min: 30, max: 60 },
      brightness: { min: 65, max: 90 },
      delay: { min: 20, max: 40 },
      rocketsPoint: { min: 30, max: 70 },
      autoresize: true,
      sound: { enabled: false },
    });

    fireworks.start();

    setTimeout(() => {
      fireworks.stop();
      if (fireworksContainer.current) {
        fireworksContainer.current.style.transition = 'opacity 0.5s ease';
        fireworksContainer.current.style.opacity = '0';
      }
    }, 2500);
  };

  const startScanner = () => {
    if (scanner) return;

    const newScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    newScanner.render(
      async (decodedText) => {
        const code = decodedText.trim().toLowerCase();
        const matched = products.find(
          (p) => p.slug.current.toLowerCase() === code
        );

        if (!matched) {
          alert(`No product matches "${code}"`);
          return;
        }

        const alreadyInCart = cart.some((item) => item._id === matched._id);
        if (alreadyInCart) return;

        await newScanner.clear(); // stop scanner
        setScanner(null); // mark scanner as inactive

        setCart((prev) => [...prev, { ...matched, quantity: 1 }]);
        launchFireworks();

        // restart scanner after delay
        setTimeout(() => {
          startScanner();
        }, 3000);
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

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="relative min-h-screen bg-white">
      <div
        ref={fireworksContainer}
        className="fixed inset-0 z-50 pointer-events-none"
      ></div>
      <div className="p-3">
        <h1 className="text-2xl uppercase font-bold mb-4">point of sale</h1>

        <button
          onClick={startScanner}
          className="p-4 block uppercase text-xs z-[10] font-light text-center bg-flag-blue text-white"
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
              <div className="uppercase text-sm">
                <div className="font-light">{item.name}</div>
                <div className="font-bold text-green">
                  ${item.price.toFixed(2)} x
                  <select
                    className="ml-2 border px-1 py-0.5"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(i, Number(e.target.value))}
                  >
                    {[...Array(item.quantity || 10)].map((_, n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-xs italic">
                    ({item.quantity ?? 'N/A'} in stock)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-flag-red text-md font-light"
                  aria-label="Remove"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-auto h-fit bg-flag-blue p-6 lg:p-12 bottom-0 left-0 lg:left-auto lg:bottom-0 lg:order-last shadow-md">
        <h3 className="uppercase text-xs font-light text-center text-white border-b pb-1">
          sale Summary
        </h3>

        <div className=" space-y-1 mt-2 mb-2">
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>Subtotal: ${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>Tax (8.25%): ${tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between uppercase text-xs font-light text-white">
            <span>Total: ${total.toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="w-full text-sm bg-green border uppercase mb-2 py-2 text-white font-light hover:bg-opacity-90 transition"
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
