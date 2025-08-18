// DrawerFilterControls.tsx

'use client';

import React, { useEffect } from 'react';
import type { OrderFilter } from '@/types/admin/order';

interface DrawerFilterControlsProps {
  filter: OrderFilter;
  setFilterAction: (filter: OrderFilter) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export default function DrawerFilterControls({
  filter,
  setFilterAction,
  isExpanded,
  setIsExpanded,
}: DrawerFilterControlsProps) {
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-30 w-full max-w-xl md:max-w-4xl mx-auto
        transition-all duration-700 ease-in-out
        ${isExpanded ? 'h-[80dvh]' : 'h-[50px]'}
        rounded-t-xl shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat
      `}
      style={{ backgroundImage: "url('/admin/orders.webp')" }}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
    >
      {!isExpanded && (
        <div className="w-10 h-1 bg-black bg-opacity-30 rounded-full mx-auto my-2"></div>
      )}

      {!isExpanded && (
        <div className="flex justify-between mx-4 text-xs font-bold text-center text-black ">
          <h3 className="mb-2 mt-1">show filters</h3>
          <h3 className="mb-2 mt-1">{filter}</h3>
        </div>
      )}

      {isExpanded && (
        <>
          <div className="flex justify-center mt-2 mb-1 text-black">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="text-white bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-5"
            >
              Hide Filters ↓
            </button>
          </div>

          <div className="px-4 pt-1 space-y-4 overflow-y-auto h-full  backdrop-blur-sm">
            {/* FILTER SELECT */}
            <div className="relative">
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilterAction(e.target.value as OrderFilter)}
                className="appearance-none uppercase text-center p-2  border-red-300 text-xs focus:outline-none focus:ring-0 transition-all w-full"
              >
                <option value="pending">Pending orders</option>
                <option value="completed">Completed orders</option>
                <option value="all">All orders</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-flag-blue">
                ▼
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
