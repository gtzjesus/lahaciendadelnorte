'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import type { Order, OrderFilter } from '@/types/admin/order';
import { useFilteredOrders } from '@/app/hooks/admin/orders/useFilteredOrders';
import OrderFilterControls from './OrderFilterControls';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('pending');

  const filteredOrders = useFilteredOrders(orders, searchTerm, filter);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  return (
    <div>
      <OrderFilterControls
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {filteredOrders.length === 0 ? (
        <p className="text-center pt-6 uppercase tracking-wide font-semibold">
          {filter === 'pending'
            ? 'All pending orders completed!'
            : 'No orders found.'}
        </p>
      ) : (
        <div className="max-w-xl mx-auto gap-1 grid grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
