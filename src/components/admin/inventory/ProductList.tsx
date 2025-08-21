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
      <p className="text-center text-xs uppercase text-black font-medium mt-6">
        no products found....
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 ">
      {products.map((p) => (
        <Link
          key={p._id}
          href={`/admin/inventory/${p.itemNumber}`}
          className="flex flex-col border border-black border-opacity-5  text-black transition px-4 py-4"
        >
          <p className="text-xs mx-auto">{p.itemNumber}</p>

          {p.imageUrl && (
            <div className="w-40 h-40 relative mb-2 mx-auto">
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                className="object-cover w-20 h-20 p-1"
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center  text-xs mb-1">
            <p className="uppercase text-xs font-bold">{p.name}</p>

            {p.category?.title && (
              <p className="text-xs text-center ">
                <span className="font-light">{p.category.title}</span>
              </p>
            )}
          </div>

          {/* {(p.variants ?? []).length > 0 && (
            <p className="text-xs  text-center mb-1">
              Stock:{' '}
              <span className="font-bold">
                {(p.variants ?? []).reduce(
                  (sum, v) => sum + Number(v.stock || 0),
                  0
                )}
              </span>
            </p>
          )} */}

          {(p.variants ?? []).length > 0 && (
            <div className=" mt-2 border-t border-black border-opacity-5 pt-2">
              <p className="text-xs text-center ">Stock</p>

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
