// OrderList.tsx

'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import type { Order, OrderFilter } from '@/types/admin/order';
import { useFilteredOrders } from '@/app/hooks/admin/orders/useFilteredOrders';
import { useTypingMessage } from '@/app/hooks/admin/orders/useTypingMessage';
import DrawerFilterControls from './DrawerFilterControls';

interface OrderListProps {
  orders: Order[];
}

const completedMessages = [
  'orders looking dry here!',
  'no orders here!',
  'Nothing to see!',
  'could not find anything!',
];

const noOrdersMessages = [
  'No orders found!',
  'Try searching again!',
  'looked but nothing!',
];

export default function OrderList({ orders }: OrderListProps) {
  const [isScrolled, setIsScrolled] = useState(false); // Track if the user has scrolled
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('pending');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredOrders = useFilteredOrders(orders, searchTerm, filter);
  const shouldTypeMessage = filteredOrders.length === 0;
  const typingMessage = useTypingMessage(
    filter === 'pending' ? completedMessages : noOrdersMessages,
    shouldTypeMessage
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

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
    <div className="relative z-10 max-w-xl mx-auto w-full dark:text-flag-red">
      {/* Search bar at the top */}
      <div className="max-w-xl fixed w-full z-10 flex flex-col">
        <input
          type="text"
          placeholder="Search order by name or #"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={` text-center p-4 border-b border-black border-opacity-5  text-sm focus:outline-none focus:ring-0 transition-all  ${
            isScrolled
              ? 'fixed border-none left-0 w-full bg-white  z-20' // Scroll down state
              : 'bg-transparent font-bold'
          }`}
        />
      </div>

      {/* Drawer filters */}
      <DrawerFilterControls
        filter={filter}
        setFilterAction={setFilter}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Orders list or message */}
      {filteredOrders.length === 0 ? (
        <div className=" flex flex-col items-center justify-center py-12 text-center">
          <p className="uppercase font-semibold text-lg select-none">
            {typingMessage}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      ) : (
        <div className="mt-20 gap-1 grid grid-cols-1 px-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
