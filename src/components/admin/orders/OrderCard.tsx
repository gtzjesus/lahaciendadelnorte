'use client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { Order } from '@/types/admin/order';
import OrderHeader from './OrderHeader';
import ProductList from './ProductList';
import OrderSummary from './OrderSummary';

interface OrderCardProps {
  order: Order;
  showDetailButton?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [pickupStatus, setPickupStatus] = useState(order.pickupStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems =
    order.products?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  const subtotal = (order.totalPrice ?? 0) - (order.tax ?? 0);
  const visibleProducts = isExpanded
    ? order.products
    : order.products?.slice(0, 3);

  async function finishPickup() {
    if (!order._id) {
      setError('Order ID missing');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/orders/finish-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to finish pickup');
      }

      setPickupStatus('completed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`p-1  overflow-hidden bg-flag-red  ${
        pickupStatus === 'pending'
          ? 'border-red-200 border'
          : 'border-green border'
      }`}
    >
      <OrderHeader order={order} />
      <ProductList products={visibleProducts} order={order} />

      {order.products?.length > 3 && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-xs uppercase text-black border p-1 bg-flag-blue border-none "
        >
          {isExpanded
            ? 'Hide items'
            : `Expand items (${order.products.length - 3})`}
        </button>
      )}

      <OrderSummary
        order={order}
        totalItems={totalItems}
        subtotal={subtotal}
        pickupStatus={pickupStatus}
      />

      {error && (
        <p className="mt-1 text-red-200 text-xs font-semibold">{error}</p>
      )}

      {pickupStatus !== 'completed' && (
        <button
          disabled={isLoading}
          onClick={finishPickup}
          className="mt-2 w-full  text-black bg-flag-blue py-2 text-xs uppercase font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Finishing Pickup...' : 'Finish Pickup'}
        </button>
      )}
      <div className="flex justify-center items-center w-full">
        <p>
          {order.orderDate
            ? new Date(order.orderDate).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'n/a'}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
