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
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">🔥 Product QR Codes</h1>

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
              textAlign: 'center',
              border: '2px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              background: '#f9f9f9',
            }}
          >
            <QRCodeCanvas
              value={product.slug.current}
              size={256} // 🔍 Make QR Code larger
              includeMargin={true}
            />
            <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
              {product.name}
            </div>
            <div>Item #: {product.itemNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
