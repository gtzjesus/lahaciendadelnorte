'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import type { Order, OrderFilter } from '@/types/admin/order';
import { useFilteredOrders } from '@/app/hooks/admin/orders/useFilteredOrders';
import OrderFilterControls from './OrderFilterControls';
import { useTypingMessage } from '@/app/hooks/admin/orders/useTypingMessage';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('pending');

  const filteredOrders = useFilteredOrders(orders, searchTerm, filter);

  const shouldTypeMessage = filteredOrders.length === 0;
  const typingMessage = useTypingMessage(
    filter === 'pending' ? completedMessages : noOrdersMessages,
    shouldTypeMessage
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  return (
    <div className="relative z-10">
      <OrderFilterControls
        filter={filter}
        setFilterAction={setFilter}
        searchTerm={searchTerm}
        setSearchTermAction={setSearchTerm}
      />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="uppercase font-semibold text-lg select-none">
            {typingMessage}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto gap-1 grid grid-cols-1 px-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
