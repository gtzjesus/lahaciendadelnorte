'use client';

import type { Order } from '@/types/admin/order';

interface OrderHeaderProps {
  order: Order;
}

const Header: React.FC<OrderHeaderProps> = ({ order }) => (
  <div className="flex border-b border-black py-2  text-xs font-mono justify-between">
    <div className="flex items-center w-1/3">
      <p className="uppercase font-light">
        Order #{order.orderNumber?.slice(-6)}{' '}
      </p>
    </div>

    <div className="flex justify-end items-center w-1/3">
      {order.customerName && (
        <p className="uppercase font-semibold">{order.customerName}</p>
      )}
    </div>
  </div>
);

export default Header;
