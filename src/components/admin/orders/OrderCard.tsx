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
      className={`p-4 shadow-md overflow-hidden bg-flag-red  ${
        pickupStatus === 'pending'
          ? 'border-red-400 border-2'
          : 'border-green border'
      }`}
    >
      <OrderHeader order={order} />
      <ProductList products={visibleProducts} order={order} />

      {order.products?.length > 3 && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-3 text-sm uppercase text-black border px-3 py-1 bg-flag-blue border-none rounded"
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
        <p className="mt-2 text-red-600 text-sm font-semibold">{error}</p>
      )}

      {pickupStatus !== 'completed' && (
        <button
          disabled={isLoading}
          onClick={finishPickup}
          className="mt-4 w-full bg-green-600 text-black bg-flag-blue py-2 text-sm uppercase font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Finishing Pickup...' : 'Finish Pickup'}
        </button>
      )}
    </div>
  );
};

export default OrderCard;
