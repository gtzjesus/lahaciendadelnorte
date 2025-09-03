'use client';

import React from 'react';
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
  const { _id, name, slug, image } = item.product;

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
          {/* ${(price * item.quantity).toFixed(0)} */}
        </p>
      </div>

      <div className="flex justify-center mb-4 gap-2">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(_id, +e.target.value)}
          className="border text-xs w-full max-w-[60px] bg-white text-center text-gray-800"
        >
          <option value="" disabled>
            QTY
          </option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
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
