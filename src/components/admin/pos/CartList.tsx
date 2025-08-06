'use client';

import Image from 'next/image';
import type { CartListProps } from '@/types/admin/pos';

export default function CartList({
  cart,
  updateQuantityAction,
  removeItemAction,
}: CartListProps) {
  return (
    <div className="mb-4 px-4">
      {cart.map((item, i) => (
        <div
          key={item._id}
          className="flex flex-col items-center border-black border m-4 bg-flag-red py-2"
        >
          <div className="w-full flex justify-between items-center px-4 text-sm">
            <div className="text-black font-medium">
              ${item.price.toFixed(2)}
            </div>
            <div className="my-2 text-center uppercase flex flex-col text-md font-semibold">
              <p>{item.name}</p>
              <p className="font-light">{item.category}</p>
            </div>
            <button
              className="text-red-500 text-sm px-2"
              onClick={() => removeItemAction(i)}
            >
              ❌
            </button>
          </div>

          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={56}
              height={56}
              className="object-cover w-20 h-20"
            />
          )}

          <div className="uppercase text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-s"></span>
              <div className="relative my-3">
                <select
                  value={item.cartQty}
                  onChange={(e) =>
                    updateQuantityAction(i, Number(e.target.value))
                  }
                  className="appearance-none border border-none bg-white px-2 py-1 pr-8 text-black text-sm uppercase w-full focus:outline-none"
                >
                  {Array.from({ length: item.stock }, (_, n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black text-xs">
                  ▼
                </div>
              </div>
            </div>
            <div className="text-green font-bold">
              ${(item.price * item.cartQty).toFixed(2)}
            </div>
          </div>
          <div className="text-xs font-light">{item.stock} available</div>
        </div>
      ))}
    </div>
  );
}
