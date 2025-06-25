'use client';

import { useEffect, useState } from 'react';
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

  // Fetch products from Sanity
  useEffect(() => {
    client
      .fetch<Product[]>(`*[_type == "product"]{_id, name, slug, price}`)
      .then(setProducts)
      .catch(console.error);
  }, []);

  // Setup QR scanner on client only
  useEffect(() => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    let scanner: any;

    async function initScanner() {
      const { Html5Qrcode } = await import('html5-qrcode');
      scanner = new Html5Qrcode('reader');

      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        const backCam = devices.find((d: any) =>
          d.label.toLowerCase().includes('back')
        );
        const cameraId = backCam?.id || devices[0].id;

        await scanner.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          (decodedText: string) => {
            const scannedCode = decodedText.trim().toLowerCase();
            const matched = products.find(
              (p) => p.slug.current === scannedCode
            );
            if (matched) {
              setCart((prev) => [...prev, matched]);
            } else {
              alert(`No matching product for code: ${scannedCode}`);
            }
          },
          (err: any) => console.warn('scan error', err)
        );
      } else {
        console.error('No camera devices found');
      }
    }

    initScanner().catch(console.error);

    return () => {
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(console.error);
      }
    };
  }, [products]);

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">ElPasoKaboom POS 💥</h1>
      <div id="reader" className="w-full max-w-md mx-auto" />
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
        onClick={() => setCart([])}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        🗑️ Clear Cart
      </button>
    </div>
  );
}
