'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CartListProps } from '@/types/admin/pos';

const messages = [
  ' Start searching to add items to this sale',
  ' Add an item and let the order begin!',
  ' Search for products to get rolling',
  ' This cart is lonely... give it some items!',
];

export default function CartList({
  cart = [], // default empty array
  updateQuantityAction,
  removeItemAction,
}: CartListProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [message] = useState(() => {
    // Pick random message only once on mount
    const randIndex = Math.floor(Math.random() * messages.length);
    return messages[randIndex];
  });
  const [isTyping, setIsTyping] = useState(false); // Added state to control the delay before typing

  useEffect(() => {
    // Start typing after a 1-2 second delay
    if (!cart || cart.length > 0) return; // Only show message if cart is empty

    const typingDelay = setTimeout(() => {
      setIsTyping(true); // Set isTyping to true after delay
    }, 2000); // Delay in milliseconds (2 seconds)

    return () => clearTimeout(typingDelay);
  }, [cart]);

  useEffect(() => {
    if (!isTyping || charIndex >= message.length) return;

    // Typing effect
    const timeout = setTimeout(() => {
      setCurrentMessage((prev) => prev + message[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, 50); // Adjust typing speed here (in ms)

    return () => clearTimeout(timeout);
  }, [charIndex, message, isTyping]);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[10rem] px-4 mt-20 text-center flex-col">
        <p className="uppercase font-semibold text-lg select-none mt-10">
          {currentMessage}
          <span> </span>
          <span className="animate-pulse">|</span>
        </p>

        {/* Add the image below the message */}
        <div className="mt-6">
          <Image
            src="/icons/order.webp" // Path to your image in the public folder
            alt="Order Illustration"
            width={100} // Smaller width for better scaling
            height={100} // Smaller height for better scaling
            className="mx-auto object-contain" // Ensures the image doesn't get chopped off
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 px-4">
      {cart.map((item, i) => (
        <div
          key={item._id}
          className="flex flex-col items-center m-4 bg-flag-red py-2"
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
