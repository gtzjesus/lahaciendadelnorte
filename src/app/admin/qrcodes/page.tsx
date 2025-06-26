'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

type Product = {
  _id: string;
  name: string;
  itemNumber: string;
  slug: { current: string };
};

export default function QRCodePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    client
      .fetch<Product[]>(`*[_type == "product"]{_id, name, itemNumber, slug}`)
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="relative min-h-screen bg-white p-3">
      <h1 className="uppercase text-xl font-semibold mb-6">
        Firworks QR Codes
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: '2px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              background: '#f9f9f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // centers horizontally
            }}
          >
            <QRCodeCanvas
              value={product.slug.current}
              size={156}
              includeMargin={true}
              style={{ display: 'block' }}
            />
            <div
              className="uppercase text-lg font-semibold"
              style={{ marginTop: '1rem', fontWeight: 'bold' }}
            >
              {product.name}
            </div>
            <div className="uppercase text-md font-light">
              Item # {product.itemNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
