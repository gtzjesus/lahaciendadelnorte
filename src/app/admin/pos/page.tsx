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

  useEffect(() => {
    client
      .fetch<Product[]>(
        `*[_type == "product"]{
      _id,
      name,
      slug,
      price
    }`
      )
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        const scannedCode = decodedText.trim().toLowerCase();
        const matched = products.find((p) => p.slug.current === scannedCode);
        if (matched) {
          setCart((prev) => [...prev, matched]);
        } else {
          alert(`No matching product for code: ${scannedCode}`);
        }
      },
      (err) => {
        // Optional: Handle errors
        console.log('error', err);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [products]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const clearCart = () => setCart([]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>ElPasoKaboom POS 💥</h1>

      <div id="reader" style={{ width: '100%', maxWidth: '400px' }}></div>

      <div style={{ marginTop: '1rem' }}>
        {cart.map((item, i) => (
          <div
            key={i}
            style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}
          >
            {item.name} - ${item.price.toFixed(2)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        Subtotal: ${subtotal.toFixed(2)} <br />
        Tax (8.25%): ${tax.toFixed(2)} <br />
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>

      <button onClick={clearCart} style={{ marginTop: '1rem' }}>
        🗑️ Clear Cart
      </button>
    </div>
  );
}
