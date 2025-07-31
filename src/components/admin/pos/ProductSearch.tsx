'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { POSProduct } from '@/types/admin/pos';

type ProductSearchProps = {
  products: POSProduct[];
  onAddToCartAction: (product: POSProduct) => void;
};

export default function ProductSearch({
  products,
  onAddToCartAction,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<POSProduct[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') return setFilteredResults([]);
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(results);
  }, [searchTerm, products]);

  return (
    <div className="px-4">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-4 border border-black uppercase text-sm"
      />

      {filteredResults.map((product) => (
        <div
          key={product._id}
          onClick={() => {
            if (product.stock > 0) {
              onAddToCartAction(product);
              setSearchTerm('');
              setFilteredResults([]);
            }
          }}
          className={`cursor-pointer flex items-center space-x-3 p-2 border-b transition ${
            product.stock > 0
              ? 'hover:bg-gray-100'
              : 'opacity-60 cursor-not-allowed'
          }`}
        >
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={48}
              height={48}
              className="object-cover w-12 h-12"
            />
          )}
          <div className="flex flex-col text-sm uppercase">
            <div className="font-semibold">
              {product.name} <strong className="px-2">|</strong>
              <strong className="text-green">${product.price}</strong>
            </div>
            <div className="flex items-center space-x-2">
              <span>{product.category}</span>
              {product.stock === 0 && (
                <p className="text-red-500 font-semibold text-sm ml-2">
                  OUT OF STOCK
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
