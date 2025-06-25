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
    <div style={{ padding: '1rem' }}>
      <h1>Product QR Codes</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
          gap: '1rem',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              textAlign: 'center',
              border: '1px solid #ccc',
              padding: '0.5rem',
            }}
          >
            <QRCodeCanvas value={product.slug.current} />
            <div>{product.name}</div>
            <div>Item #: {product.itemNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
