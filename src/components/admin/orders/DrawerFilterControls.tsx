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
      style={{ backgroundImage: "url('/admin/orders.gif')" }}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
    >
      {!isExpanded && (
        <div className="w-10 h-1 bg-black bg-opacity-30 rounded-full mx-auto my-2"></div>
      )}

      {!isExpanded && (
        <div className="flex justify-between mx-4 text-xs font-bold text-center text-black ">
          <h3>filters </h3>
          <h3>{filter} orders</h3>
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
              <p className="text-xs text-center font-bold mb-4">
                Filter by order category below
              </p>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilterAction(e.target.value as OrderFilter)}
                className="appearance-none uppercase text-center w-full border border-black border-opacity-5 px-2 py-2 pr-8 text-xs bg-flag-red rounded shadow-xl"
              >
                <option value="pending">Pending orders</option>
                <option value="completed">Completed orders</option>
                <option value="all">All orders</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
