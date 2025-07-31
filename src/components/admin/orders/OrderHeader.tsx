'use client';

import type { Order } from '@/types/admin/order';

interface OrderHeaderProps {
  order: Order;
}

const Header: React.FC<OrderHeaderProps> = ({ order }) => (
  <div className="flex border-b border-black pb-2 mb-3 text-sm font-mono justify-between">
    <div className="flex items-center w-1/3">
      <p className="uppercase font-light">Order # </p>
      <span className="text-black ml-2">{order.orderNumber?.slice(-6)}</span>
    </div>

    <div className="flex justify-end items-center w-1/3">
      {order.customerName && (
        <p className="uppercase font-semibold">{order.customerName}</p>
      )}
    </div>
  </div>
);

export default Header;
