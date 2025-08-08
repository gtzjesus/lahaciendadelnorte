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
      <div className="flex flex-col items-center justify-center flex-1 min-h-screen px-4 text-center">
        <p className="uppercase font-semibold text-lg select-none">
          {currentMessage}
          <span> </span>
          <span className="animate-pulse">|</span>
        </p>

        {/* Add the image below the message */}
        <Image
          src="/icons/order.webp" // Path to your image in the public folder
          alt="Order Illustration"
          width={100} // Smaller width for better scaling
          height={100} // Smaller height for better scaling
          className="mx-auto mt-6 object-contain" // Ensures the image doesn't get chopped off
        />
      </div>
    );
  }

  return (
    <div className="py-20 grid grid-cols-2 gap-1">
      {cart.map((item, i) => (
        <div
          key={item._id}
          className="bg-flag-red pt-2 flex flex-col items-center text-center"
        >
          <div className="w-full flex justify-between items-center px-2 text-xs">
            <div className="text-black font-semibold">
              ${item.price.toFixed(2)}
            </div>
            <button
              className="text-red-500 text-xs px-1"
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
              className="object-cover w-20 h-20 p-1"
            />
          )}
          <div className="w-full  justify-between items-center py-1 text-xs text-center uppercase flex flex-col font-semibold">
            <p>{item.name}</p>
            <p className="font-light">{item.category}</p>
          </div>

          <div className="uppercase text-sm flex items-center justify-between gap-1">
            <div className="flex items-center">
              <div className="relative my-2">
                <select
                  value={item.cartQty}
                  onChange={(e) =>
                    updateQuantityAction(i, Number(e.target.value))
                  }
                  className="appearance-none border border-none bg-white px-2 py-1 text-black text-xs uppercase w-[20vw] focus:outline-none"
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
          <div className="text-xs font-light pb-1">{item.stock} available</div>
        </div>
      ))}
    </div>
  );
}
