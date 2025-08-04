'use client';

import type { AdminProduct } from '@/types/admin/inventory';
import Image from 'next/image';
import Link from 'next/link';

type ProductListProps = {
  products: AdminProduct[];
};

export default function ProductList({ products }: ProductListProps) {
  if (!products.length) {
    return (
      <p className="text-center text-sm uppercase text-black font-medium mt-6">
        No products found. Try again
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {products.map((p) => (
        <Link
          key={p._id}
          href={`/admin/inventory/${p.itemNumber}`}
          className="flex flex-col border border-black bg-flag-red text-black transition px-4 py-4"
        >
          <div className="flex flex-col justify-center items-center uppercase text-xs mb-1">
            <p className="text-sm">#{p.itemNumber}</p>
            <p className="text-sm font-semibold">{p.name}</p>
          </div>

          {p.imageUrl && (
            <div className="w-full h-40 relative mb-2">
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {p.category?.title && (
            <p className="text-xs text-center uppercase">
              <span className="font-semibold">{p.category.title}</span>
            </p>
          )}

          {(p.variants ?? []).length > 0 && (
            <p className="text-xs uppercase text-center mb-1">
              stock:{' '}
              <span className="font-semibold">
                {(p.variants ?? []).reduce(
                  (sum, v) => sum + Number(v.stock || 0),
                  0
                )}
              </span>
            </p>
          )}

          {(p.variants ?? []).length > 0 && (
            <div className="uppercase mt-2 border-t border-black pt-2">
              <ul className="text-xs space-y-1">
                {p.variants.map((v, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{v.size}</span>
                    <span>
                      ${parseFloat(v.price || '0').toFixed(2)} – {v.stock}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
