'use client';

import { useEffect, useState, RefObject } from 'react';
import Image from 'next/image';
import type { POSProduct } from '@/types/admin/pos';

type ProductSearchProps = {
  products: POSProduct[];
  onAddToCartAction: (product: POSProduct) => void;
  productListRef?: RefObject<HTMLDivElement>;
};

export default function ProductSearch({
  products,
  onAddToCartAction,
  productListRef,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<POSProduct[]>([]);
  const [isScrolled, setIsScrolled] = useState(false); // Track if the user has scrolled

  useEffect(() => {
    if (searchTerm.trim() === '') return setFilteredResults([]);
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(results);
  }, [searchTerm, products]);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // If scrolled more than 50px
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-xl fixed w-full z-10 flex flex-col">
      <input
        type="text"
        placeholder="What are we selling today?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`uppercase text-center p-4 border-b text-sm focus:outline-none focus:ring-0 transition-all ${
          isScrolled
            ? 'fixed border-none left-0 w-full bg-white text-white z-20' // Scroll down state
            : 'bg-white text-black'
        }`}
      />

      {/* Attach ref to this scrolling container */}
      <div
        ref={productListRef}
        className="max-h-[1000px] overflow-y-auto bg-white"
      >
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
            className={`bg-white cursor-pointer flex items-center space-x-3 p-2 border-b transition ${
              product.stock > 0 ? '' : ' cursor-not-allowed opacity-40'
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
    </div>
  );
}
