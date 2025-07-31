// components/orders/OrderList.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderCard from '../../orders/OrderCard';

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
        <div className="relative w-full max-w-[150px] mr-2">
          <select
            id="filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as 'all' | 'pending' | 'completed')
            }
            className="appearance-none uppercase text-sm border border-black px-2 py-2 w-full bg-white text-black rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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
