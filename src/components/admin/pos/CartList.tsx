'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CartListProps } from '@/types/admin/pos';

const messages = [
  ' Start searching to add items to this sale',
  ' Add an item by searching and let the order begin!',
  ' Search for products to get rolling!',
  ' This cart is lonely... search & add some items!',
];

export default function CartList({
  cart = [],
  updateQuantityAction,
  removeItemAction,
}: CartListProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [message] = useState(() => {
    const randIndex = Math.floor(Math.random() * messages.length);
    return messages[randIndex];
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!cart || cart.length > 0) return;

    const typingDelay = setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    return () => clearTimeout(typingDelay);
  }, [cart]);

  useEffect(() => {
    if (!isTyping || charIndex >= message.length) return;

    const timeout = setTimeout(() => {
      setCurrentMessage((prev) => prev + message[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, 50);

    return () => clearTimeout(timeout);
  }, [charIndex, message, isTyping]);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 mt-40  px-4 text-center ">
        <Image
          src="/icons/order.gif"
          alt="Order Illustration"
          width={150}
          height={150}
          className="mx-auto mb-4 object-contain"
        />
        <p className="font-light text-sm select-none dark:text-flag-red">
          {currentMessage}
          <span> </span>
          <span className="animate-pulse">|</span>
        </p>
      </div>
    );
  }

  return (
    <div className="py-20 grid grid-cols-2  dark:text-flag-red">
      {cart.map((item, i) => (
        <div
          key={item._id}
          className=" flex flex-col justify-between p-2 text-center border border-black dark:border-flag-red border-opacity-5"
        >
          {/* Top: Price and ❌ */}
          <div className="flex justify-between items-center text-xs px-1">
            <div className="text-black font-semibold dark:text-flag-red">
              ${item.price.toFixed(2)}
            </div>
            <button
              className="text-red-500 text-xs"
              onClick={() => removeItemAction(i)}
            >
              ❌
            </button>
          </div>

          {/* Middle: Image and Info */}
          <div className="flex flex-col items-center justify-center flex-grow ">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={56}
                height={56}
                className="object-cover w-20 h-20 p-1"
              />
            )}
            <div className="text-xs  font-semibold mt-2 ">
              <p className="uppercase ">{item.name}</p>
              <p className="font-light">{item.category}</p>
              <div className="relative">
                <select
                  value={item.cartQty}
                  onChange={(e) =>
                    updateQuantityAction(i, Number(e.target.value))
                  }
                  className="appearance-none border dark:border-flag-red border-black  border-opacity-10 my-2 bg-white p-2 text-black text-xs uppercase w-[8vh] focus:outline-none "
                >
                  {Array.from({ length: item.stock }, (_, n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
                {/* <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-black text-xs">
                  ▼
                </div> */}
              </div>
              <div className="text-green font-bold">
                ${(item.price * item.cartQty).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Bottom: Quantity, Total, Stock */}
          <div className="text-sm flex flex-col items-center gap-1">
            <div className="flex items-center gap-2"></div>
            <div className="text-xs font-light">{item.stock} available</div>
          </div>
        </div>
      ))}
    </div>
  );
}
