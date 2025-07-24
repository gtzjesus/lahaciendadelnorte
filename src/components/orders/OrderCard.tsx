'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface OrderCardProps {
  order: any;
  showDetailButton?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [pickupStatus, setPickupStatus] = useState(order.pickupStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = order.products?.reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 0),
    0
  );
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
      const res = await fetch('/api/finish-order', {
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
      <Header order={order} />
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

const Header = ({ order }: { order: any }) => (
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

const ProductList = ({ products, order }: { products: any[]; order: any }) => (
  <div className="space-y-3 mb-4">
    <div className="flex justify-end items-center w-full">
      <p className="text-black text-xs sm:text-sm">
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

    {products?.map((product: any, index: number) => {
      const prod = product.product;
      const slug = prod?.slug?.current;
      const image = prod?.image ? imageUrl(prod.image).url() : null;

      return (
        <div
          key={product._key ?? index}
          className="flex gap-3 items-start border-b border-black pb-2"
        >
          {image && (
            <Link
              href={`/product/${slug}`}
              className="relative h-16 w-16 shrink-0"
            >
              <Image
                src={image}
                alt={prod.name}
                fill
                className="object-cover rounded"
              />
            </Link>
          )}
          <div className="text-sm text-black font-light uppercase">
            <p className="font-semibold">{prod?.name}</p>
            {product.variant?.size && <p>{product.variant.size}</p>}
            {prod?.category?.title && <p>{prod.category.title}</p>}
            {typeof product?.price === 'number' && (
              <p>{formatCurrency(product.price, order.currency || 'usd')}</p>
            )}
            <p>Qty: {product.quantity}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const OrderSummary = ({
  order,
  totalItems,
  subtotal,
  pickupStatus,
}: {
  order: any;
  totalItems: number;
  subtotal: number;
  pickupStatus?: string;
}) => (
  <div className="uppercase text-sm pt-3 mt-3 space-y-1 font-mono text-black">
    <div className="flex justify-between">
      <span>Total items:</span>
      <span>{totalItems}</span>
    </div>
    <div className="flex justify-between">
      <span>Subtotal:</span>
      <span>{formatCurrency(subtotal, order.currency || 'usd')}</span>
    </div>
    {order.tax && (
      <div className="flex justify-between">
        <span>Tax:</span>
        <span>{formatCurrency(order.tax, order.currency || 'usd')}</span>
      </div>
    )}
    <div className="flex justify-between border-b border-black pb-2">
      <strong>Total:</strong>
      <strong className="text-green">
        {formatCurrency(order.totalPrice, order.currency || 'usd')}
      </strong>
    </div>

    <div className=" space-y-1 ">
      {order.paymentMethod && (
        <p className="">
          Payment: <strong>{order.paymentMethod}</strong>
        </p>
      )}

      {/* Show cash payment details */}
      {order.paymentMethod === 'cash' && (
        <>
          <p className="">
            Cash Received:{' '}
            <strong>
              {formatCurrency(order.cashReceived || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p className="">
            Change Given:{' '}
            <strong>
              {formatCurrency(order.changeGiven || 0, order.currency || 'usd')}
            </strong>
          </p>
        </>
      )}

      {/* Show split payment details */}
      {order.paymentMethod === 'split' && (
        <>
          <p className="">
            Cash Received:{' '}
            <strong>
              {formatCurrency(order.cashReceived || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p className="">
            Card Amount:{' '}
            <strong>
              {formatCurrency(order.cardAmount || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p className="">
            Change Given:{' '}
            <strong>
              {formatCurrency(order.changeGiven || 0, order.currency || 'usd')}
            </strong>
          </p>
        </>
      )}

      <p className=" border-t pt-2 border-black">
        Status:{' '}
        <strong
          className={
            order.paymentStatus === 'paid_in_store' ||
            order.paymentStatus === 'paid_online'
              ? 'text-green'
              : 'text-flag-red'
          }
        >
          {order.paymentStatus.replaceAll('_', ' ')}
        </strong>
      </p>
      <p className="">
        Pickup:{' '}
        <strong
          className={
            pickupStatus === 'completed' ? 'text-green' : 'text-red-600'
          }
        >
          {pickupStatus?.replaceAll('_', ' ') ??
            order.pickupStatus.replaceAll('_', ' ')}
        </strong>
      </p>
    </div>
  </div>
);
