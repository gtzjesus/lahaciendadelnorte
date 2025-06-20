'use client';

import { toast } from 'sonner';
import { useState } from 'react';

interface NewOrderToastProps {
  t: string | number; // ✅ Fix here
  orderNumber: string;
  customerName?: string;
  totalPrice: number;
  onView: () => void;
}

export default function NewOrderToast({
  t,
  orderNumber,
  customerName,
  totalPrice,
  onView,
}: NewOrderToastProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div
      className="bg-green-700 text-white p-4 rounded shadow-lg mb-2 w-72 cursor-pointer"
      onClick={toggleExpand}
    >
      <div className="text-sm font-light uppercase">
        New Order from {customerName || 'Customer'}!
      </div>

      {expanded && (
        <>
          <div className="text-xs font-medium mt-1">
            Order #{orderNumber || '—'} • ${totalPrice}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(); // your logic
              toast.dismiss(t); // ✅ works because t is string | number
            }}
            className="mt-3 text-xs uppercase font-semibold bg-white text-flag-blue px-3 py-1"
          >
            View Order
          </button>
        </>
      )}
    </div>
  );
}
