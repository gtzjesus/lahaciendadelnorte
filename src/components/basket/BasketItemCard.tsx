'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import { BasketItem } from '@/types';

interface BasketItemCardProps {
  item: BasketItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const BasketItemCard: React.FC<BasketItemCardProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const router = useRouter();
  const { _id, name, price, slug, image } = item.product;

  const [liveStock, setLiveStock] = useState<number | null>(
    item.product.stock ?? null
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`/api/stock?ids=${_id}`);
        const data = await res.json();
        setLiveStock(data[_id]);
      } catch (err) {
        console.error(`❌ Failed to fetch live stock for ${_id}:`, err);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 5000);

    return () => clearInterval(interval);
  }, [_id]);

  const getStockStatus = (stock?: number) =>
    typeof stock === 'number' && stock > 0 ? (
      <span className="font-semibold text-green-600">Available</span>
    ) : (
      <span className="font-semibold text-flag-red">Out of stock</span>
    );

  return (
    <div className="p-2 border-b">
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/product/${slug?.current}`)}
      >
        <div className="flex justify-center items-center w-full h-[200px]">
          {image && (
            <Image
              src={imageUrl(image).url()}
              alt={name ?? 'Product Image'}
              width={150}
              height={150}
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-center text-center p-1 gap-2">
        <h2 className="uppercase text-md font-semibold text-gray-800">
          {name}
        </h2>
        <p className="font-light">|</p>
        <p className="text-sm font-light text-gray-800">
          ${(price! * item.quantity).toFixed(0)}
        </p>
      </div>

      <div className="flex justify-center mb-4 gap-2">
        <p className="text-xs font-light text-gray-600 my-2">
          {getStockStatus(liveStock ?? 0)}
        </p>

        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(_id, +e.target.value)}
          className="border text-xs w-full max-w-[60px] bg-white text-center text-gray-800"
          disabled={!liveStock || liveStock === 0}
        >
          <option value="" disabled>
            QTY
          </option>
          {Array.from({ length: liveStock ?? 0 }, (_, i) => i + 1).map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onRemove(_id)}
          className="text-xs underline font-light text-gray-800 hover:text-red-600 transition"
        >
          remove
        </button>
      </div>
    </div>
  );
};

export default BasketItemCard;
