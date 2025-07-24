// components/orders/OrderList.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export default function OrderList({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>(
    'pending'
  );

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.pickupStatus === filter;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor="filter"
          className="block text-sm font-semibold uppercase mb-1"
        ></label>
        <select
          id="filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as 'all' | 'pending' | 'completed')
          }
          className="uppercase text-sm border border-black px-2 py-2  bg-white text-black"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="all">All</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600 uppercase tracking-wide font-light">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredOrders.map((order: any) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
