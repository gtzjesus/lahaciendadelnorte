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
  stock?: number;
};

type CartItem = Product & { cartQty: number };

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const fireworksContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Fetch products once on mount
  useEffect(() => {
    client
      .fetch<Product[]>(`*[_type == "product"]{_id, name, slug, price, stock}`)
      .then(setProducts)
      .catch(console.error);
  }, []);

  // Fireworks celebration effect
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

  // Start the QR scanner
  const startScanner = () => {
    if (scanner) return; // already running

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

        await newScanner.clear();
        setScanner(null);

        setCart((prev) => [...prev, { ...matched, cartQty: 1 }]);
        launchFireworks();

        // Restart scanner after delay
        setTimeout(() => {
          startScanner();
        }, 3000);
      },
      (err) => {
        // QR errors can be noisy, just log
        console.warn('QR error:', err);
      }
    );

    setScanner(newScanner);
  };

  // Update quantity of cart item safely (min 1, max stock)
  const updateQuantity = (index: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cartQty: Math.min(Math.max(qty, 1), item.stock || 1) }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  // Handle Sale API call
  const handleSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.cartQty,
            price: item.price,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Sale failed: ${errorData.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        clearCart();
        alert(`✅ Sale complete! Order ID: ${data.orderId}`);
      } else {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      }
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      alert(`❌ Error: ${error.message || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

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
          disabled={!!scanner}
          className="p-4 block uppercase text-xs z-[10] font-light text-center bg-flag-blue text-white"
        >
          {scanner ? 'Scanning...' : 'Start Scanning'}
        </button>

        <div id="reader" className="w-full max-w-md mx-auto mt-4"></div>

        <div className="mt-6 space-y-4">
          {cart.map((item, i) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="uppercase text-sm">
                <div className="font-light">{item.name}</div>
                <div className="font-bold text-green">
                  ${item.price.toFixed(2)} x
                  <select
                    className="ml-2 border px-1 py-0.5"
                    value={item.cartQty}
                    onChange={(e) => updateQuantity(i, Number(e.target.value))}
                  >
                    {[...Array(item.stock || 1)].map((_, n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-xs italic text-gray-500">
                    ({item.stock ?? 'N/A'} in stock)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">
                  ${(item.price * item.cartQty).toFixed(2)}
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
          Sale Summary
        </h3>

        <div className="space-y-1 mt-2 mb-2">
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
          onClick={handleSale}
          disabled={cart.length === 0 || loading}
          className="w-full text-sm bg-green border uppercase mb-2 py-2 text-white font-light hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Sale...' : `Sale Total: $${total.toFixed(2)}`}
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
