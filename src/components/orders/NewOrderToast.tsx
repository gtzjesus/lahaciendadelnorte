'use client';

import { useState } from 'react';

interface NewOrderToastProps {
  t: string | number;
  orderId: string;
  orderNumber: string;
  customerName?: string;
  totalPrice: number;
  onView: () => void;
}

export default function NewOrderToast({
  orderNumber,
  customerName,
  totalPrice,
  onView,
}: NewOrderToastProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent re-triggering expand on button click
    onView(); // marks as seen + navigates
  };

  return (
    <div
      className="mt-12 bg-green text-white p-4 rounded shadow-lg mb-2 w-72 cursor-pointer transition-all"
      onClick={toggleExpand}
    >
      <div className="text-sm font-light uppercase">
        New Order from {customerName || 'Customer'}!
        <div className="text-right text-xs italic opacity-60 mt-2">
          {expanded ? 'Tap to hide' : 'Tap to view details'}
        </div>
      </div>

      {expanded && (
        <>
          <div className="text-xs font-medium mt-1">
            Order #{orderNumber || '—'} • ${totalPrice}
          </div>
          <button
            onClick={handleViewClick}
            className="mt-3 text-xs uppercase font-semibold bg-white text-flag-blue px-3 py-1 rounded"
          >
            View Order
          </button>
        </>
      )}
    </div>
  );
}
