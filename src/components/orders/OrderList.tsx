// components/orders/OrderList.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export default function OrderList({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>(
    'pending'
  );
  const filteredOrders = orders
    .filter((order) => {
      const term = searchTerm.toLowerCase();
      const matchesOrderNumber = order.orderNumber
        ?.toLowerCase()
        .includes(term);
      const matchesCustomerName = order.customerName
        ?.toLowerCase()
        .includes(term);
      const matchesStatus =
        filter === 'all' || order.pickupStatus?.toLowerCase() === filter;

      return (matchesOrderNumber || matchesCustomerName) && matchesStatus;
    })
    .sort((a, b) => {
      // Sort so "pending" comes before "completed"
      if (a.pickupStatus === b.pickupStatus) return 0;
      if (a.pickupStatus === 'pending') return -1;
      if (b.pickupStatus === 'pending') return 1;
      return 0;
    });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  return (
    <div>
      <div className="mb-6 flex">
        <div className="">
          <select
            id="filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as 'all' | 'pending' | 'completed')
            }
            className="uppercase text-sm border border-black px-2 py-2  w-full bg-white text-black"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            id="search"
            placeholder="Search name or number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="uppercase ml-2 text-sm border border-black px-2 py-2  w-full"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center pt-6 text-green-600 uppercase tracking-wide font-semibold">
          {filter === 'pending'
            ? 'All pending orders completed!'
            : 'No orders found.'}
        </p>
      ) : (
        <div className="space-y-6 max-w-xl mx-auto">
          {filteredOrders.map((order: any) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
