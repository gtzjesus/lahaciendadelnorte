'use client';

import type { Order } from '@/types/admin/order';

interface OrderHeaderProps {
  order: Order;
}

const Header: React.FC<OrderHeaderProps> = ({ order }) => (
  <div className="flex flex-col items-center gap-1 justify-center border-b border-red-200 py-1 text-xs  ">
    <div>
      <p className="uppercase font-bold">
        Order #{order.orderNumber?.slice(-6)}{' '}
      </p>
    </div>

    <div>
      {order.customerName && (
        <p className="uppercase font-semibold"> {order.customerName}</p>
      )}
    </div>
  </div>
);

export default Header;
