'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { client } from '@/sanity/lib/client';
import { Fireworks } from 'fireworks-js';
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  stock?: number;
  imageUrl?: string;
};

type CartItem = Product & { cartQty: number };

export default function POSPage() {
  const [finalTotal, setFinalTotal] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const fireworksContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch<Product[]>(
        `
        *[_type == "product"]{
          _id,
          name,
          slug,
          price,
          stock,
          "imageUrl": image.asset->url
        }
      `
      )
      .then((res) => setProducts(res))
      .catch(console.error);
  }, []);

  const launchFireworks = () => {
    if (!fireworksContainer.current) return;
    fireworksContainer.current.innerHTML = '';
    fireworksContainer.current.style.opacity = '1';
    const fireworksInstance = new Fireworks(fireworksContainer.current, {
      opacity: 0.8,
      acceleration: 1.2,
      friction: 0.95,
      gravity: 1.5,
      explosion: 6,
      particles: 80,
      traceLength: 4,
      traceSpeed: 7,
      flickering: 20,
      lineStyle: 'round',
      hue: { min: 0, max: 360 },
      brightness: { min: 50, max: 100 },
      delay: { min: 20, max: 50 },
      rocketsPoint: { min: 10, max: 90 },
      autoresize: true,
      sound: { enabled: false },
    });
    fireworksInstance.start();
    return fireworksInstance;
  };

  // Clean up scanner only on unmount — no dependency on scanner state
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, []);

  const startScanner = () => {
    if (scanner) return; // scanner already running

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

        if ((matched.stock ?? 0) <= 0) {
          alert(`${matched.name} is out of stock.`);
          return;
        }

        if (cart.some((item) => item._id === matched._id)) return;

        // Clear and dispose scanner *and reset state* BEFORE continuing
        await newScanner.clear();
        setScanner(null);

        setCart((prev) => [...prev, { ...matched, cartQty: 1 }]);

        const fireworksScan = launchFireworks();
        setTimeout(() => fireworksScan?.stop(), 2000);

        // Restart scanner after delay
        setTimeout(startScanner, 3000);
      },
      (err) => console.warn('QR error:', err)
    );

    setScanner(newScanner);
  };

  const stopScanner = async () => {
    if (scanner) {
      await scanner.clear();
      setScanner(null);
    }
  };

  const updateQuantity = (index: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cartQty: Math.min(Math.max(qty, 1), item.stock || 1) }
          : item
      )
    );
  };

  const removeItem = (i: number) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => {
    if ((item.stock ?? 0) <= 0) return sum;
    return sum + item.price * item.cartQty;
  }, 0);

  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleSale = async () => {
    if (!cart.length) return alert('Cart is empty!');
    setLoading(true);

    const stockErrors = cart.filter((item) => {
      const inStock = item.stock ?? 0;
      return item.cartQty > inStock || inStock <= 0;
    });

    if (stockErrors.length) {
      const names = stockErrors.map((i) => i.name).join(', ');
      alert(`❌ Not enough stock for: ${names}`);
      setLoading(false);
      return;
    }

    try {
      const payloadItems = cart.map((item) => ({
        productId: item._id,
        quantity: item.cartQty,
        price: item.price,
        finalPrice: item.price * item.cartQty,
      }));

      const res = await fetch('/api/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      } else {
        setFinalTotal(total);
        clearCart();
        setShowCelebration(true);
        const fireworksSale = launchFireworks();
        celebrationTimeout.current = setTimeout(() => {
          fireworksSale?.stop();
          setShowCelebration(false);
          router.push('/admin/orders');
        }, 10000);
      }
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      alert(`❌ Error: ${err.message || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      <div
        ref={fireworksContainer}
        className="fixed inset-0 z-[2000] pointer-events-none"
        style={{ opacity: '0', transition: 'opacity 0.5s' }}
      />
      {showCelebration && (
        <div className="fixed inset-0 z-[210] flex flex-col items-center justify-center bg-flag-blue bg-opacity-90 text-white p-6 text-center">
          <h1 className="text-5xl text-yellow font-extrabold mb-4 animate-bounce">
            Sale Success!
          </h1>

          {finalTotal !== null && (
            <p className="text-2xl text-yellow font-extrabold mb-4 animate-bounce">
              Total: ${finalTotal.toFixed(2)}
            </p>
          )}

          <button
            onClick={() => {
              setShowCelebration(false);
              router.push('/admin/orders');
            }}
            className="bg-white text-flag-blue uppercase px-6 py-3 font-light"
          >
            View Orders
          </button>
        </div>
      )}

      <div className="p-3">
        <h1 className="text-2xl uppercase font-bold mb-4">point of sale</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={startScanner}
            disabled={!!scanner}
            className="p-4 block uppercase text-xs z-[10] font-light text-center bg-flag-blue text-white flex-1"
          >
            {scanner ? 'Scanning...' : 'Start Scanning'}
          </button>
          <button
            onClick={stopScanner}
            disabled={!scanner}
            className="p-4 block uppercase text-xs z-[10] font-light text-center bg-flag-red text-white flex-1"
          >
            Stop Scanning
          </button>
        </div>

        <div id="reader" className="w-full max-w-md mx-auto" />

        <div className="mt-6 space-y-4">
          {cart.map((item, i) => {
            const lineTotal = item.price * item.cartQty;

            return (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center">
                  {item.imageUrl && (
                    <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="uppercase text-sm">
                    <div className="font-light">{item.name}</div>
                    <div className="font-bold text-green">
                      ${item.price.toFixed(2)} x
                      {(item.stock ?? 0) > 0 ? (
                        <select
                          className="ml-2 border px-1 py-0.5"
                          value={item.cartQty}
                          onChange={(e) =>
                            updateQuantity(i, Number(e.target.value))
                          }
                        >
                          {[...Array(item.stock)].map((_, n) => (
                            <option key={n + 1} value={n + 1}>
                              {n + 1}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="ml-2 text-xs text-red-600 font-semibold">
                          Out of stock
                        </span>
                      )}
                      {item.stock !== undefined ? (
                        <span
                          className="ml-2 text-xs italic font-semibold"
                          style={{
                            color: item.stock === 0 ? 'red' : '#6b7280',
                          }}
                        >
                          ({item.stock} in stock)
                        </span>
                      ) : (
                        <span className="ml-2 text-xs italic text-gray-500">
                          (N/A stock)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold">${lineTotal.toFixed(2)}</div>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-flag-red mt-1"
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-auto bg-flag-blue p-6 lg:p-12 shadow-md">
        <h3 className="uppercase text-xs font-light text-center text-white border-b pb-1">
          Sale Summary
        </h3>
        <div className="space-y-1 mt-2 mb-2 text-white uppercase text-xs font-light">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (8.25%): ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleSale}
          disabled={loading || cart.length === 0}
          className="w-full bg-green py-2 text-white uppercase font-light disabled:opacity-50"
        >
          {loading ? 'Processing Sale...' : `Sale Total: $${total.toFixed(2)}`}
        </button>
        <button
          onClick={clearCart}
          className="w-full mt-2 bg-flag-red py-2 text-white uppercase font-light"
        >
          Clear Sale
        </button>
      </div>
    </div>
  );
}
