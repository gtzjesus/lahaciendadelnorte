'use client';

import React, { useEffect, useState } from 'react';
import type { OrderFilter } from '@/types/admin/order';

interface OrderFilterControlsProps {
  filter: OrderFilter;
  setFilterAction: (filter: OrderFilter) => void;
  searchTerm: string;
  setSearchTermAction: (term: string) => void;
}

export default function OrderFilterControls({
  filter,
  setFilterAction,
  searchTerm,
  setSearchTermAction,
}: OrderFilterControlsProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-flag-red/95 backdrop-blur-sm shadow-md border-b border-black'
          : 'bg-transparent'
      }`}
    >
      <div className="p-3 max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-2">
        {/* FILTER */}
        <div className="relative w-full sm:max-w-[150px]">
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilterAction(e.target.value as OrderFilter)}
            className="appearance-none uppercase text-sm border-none border-black p-4 w-full bg-white text-black focus:outline-none focus:ring-0"
          >
            <option value="pending">Pending orders </option>
            <option value="completed">Completed orders </option>
            <option value="all">All orders</option>
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

        {/* SEARCH */}
        <div className="flex-1 w-full">
          <input
            type="text"
            id="search"
            placeholder="Search order by name/number"
            value={searchTerm}
            onChange={(e) => setSearchTermAction(e.target.value)}
            className="uppercase text-sm border-none p-4 w-full bg-white focus:outline-none focus:ring-0 "
          />
        </div>
      </div>
    </div>
  );
}
