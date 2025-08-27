'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center text-sm text-gray-500 py-20">
        No storage options available.
      </div>
    );
  }

  return (
    <div className="flex flex-col  min-h-screen mx-auto max-w-4xl">
      <div className="max-w-4xl fixed w-full z-10 flex flex-col mt-20">
        <div className="grid grid-cols-2  ">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/store/products/${product.slug?.current || product._id}`}
              className="flex flex-col border border-black dark:border-flag-red border-opacity-5 dark:text-flag-red  text-white transition px-4 py-4"
            >
              <div className="flex flex-col items-center px-4 py-4">
                <p className="text-xs mx-auto">{product.itemNumber}</p>

                {product.imageUrl && (
                  <div className="w-40 h-40 relative mb-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                )}

                <div className="text-center text-sm mb-2">
                  <p className="font-semibold uppercase">{product.name}</p>

                  {product.category?.title && (
                    <p className="text-xs mx-auto">{product.category.title}</p>
                  )}
                </div>

                {(product.variants ?? []).length > 0 && (
                  <div className="w-full mt-2 border-t border-gray-200 pt-2">
                    <p className="text-xs mx-auto text-center mb-1">Variants</p>
                    <ul className="text-xs space-y-1">
                      {(product.variants ?? []).map((v, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{v.size || v.dimensions || 'N/A'}</span>
                          <span>
                            ${(v.price ?? 0).toFixed(2)} – {v.stock ?? 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
