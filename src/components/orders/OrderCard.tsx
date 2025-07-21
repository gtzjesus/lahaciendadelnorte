'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface OrderCardProps {
  order: any;
  showDetailButton?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showDetailButton = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = order.products?.reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 0),
    0
  );

  const subtotal =
    typeof order.totalPrice === 'number' && typeof order.tax === 'number'
      ? order.totalPrice - order.tax
      : 0;

  const visibleProducts = isExpanded
    ? order.products
    : order.products?.slice(0, 3);

  return (
    <div className="bg-flag-red border border-black p-2 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-black">
        <div className="flex flex-row justify-between">
          <div>
            <p className="text-xs uppercase font-light font-mono">
              order number
            </p>
            <span
              className="font-mono uppercase font-light text-xs text-black dark:text-green"
              title={order.orderNumber || ''}
            >
              {order.orderNumber?.slice(-6)}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase font-light font-mono">sale date</p>
            <p className="font-light text-xs mt-1 text-black">
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : 'n/a'}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="font-mono p-4">
        <p className="text-xs uppercase font-light text-gray-600">
          items ({totalItems})
        </p>

        <div>
          {visibleProducts?.map((product: any, index: number) => {
            const prod = product.product;
            const slug = prod?.slug?.current;
            console.log('🧪 product object:', product);

            const baseKey = `${prod?._id ?? 'noid'}-${product._key ?? index}`;

            if (!prod?._id && !product._key) {
              console.warn('⚠️ Product is missing both _id and _key:', product);
            }

            return (
              <div
                key={baseKey}
                className="flex flex-col border-b border-black last:border-b-0"
              >
                <div className="flex items-center gap-6">
                  {prod?.image && slug && (
                    <Link
                      href={`/product/${slug}`}
                      className="relative h-20 w-20 flex-shrink-0 mt-2 mb-2"
                      aria-label={`View ${prod.name}`}
                    >
                      <Image
                        src={imageUrl(prod.image).url()}
                        alt={prod.name ?? ''}
                        className="object-cover"
                        fill
                        priority
                      />
                    </Link>
                  )}
                  <div>
                    <div className="">
                      {slug ? (
                        <Link
                          href={`/product/${slug}`}
                          className="text-xs uppercase text-black font-light  hover:underline"
                        >
                          {prod?.name}
                        </Link>
                      ) : (
                        <p className="text-xs uppercase text-gray-600 font-light ">
                          {prod?.name}
                        </p>
                      )}

                      {/* ✅ Show Variant Size (if available) */}
                      {product.variantSize && (
                        <p className="text-xs uppercase font-light text-gray-700">
                          size: {product.variantSize}
                        </p>
                      )}

                      {prod?.category?.title && (
                        <p className="text-xs uppercase font-light">
                          {prod.category.title}
                        </p>
                      )}
                    </div>

                    {typeof product?.price === 'number' && (
                      <p className="text-xs my-1 uppercase font-light ">
                        price:{' '}
                        {formatCurrency(product.price, order.currency || 'usd')}
                      </p>
                    )}

                    {/* {prod?.itemNumber && (
                      <p className="text-xs uppercase font-light text-gray-600">
                        item #: {prod.itemNumber}
                      </p>
                    )} */}
                    {typeof prod?.stock === 'number' && (
                      <p className="text-xs uppercase font-light text-gray-600">
                        stock: {prod.stock}
                      </p>
                    )}
                    <p className="text-xs uppercase font-light text-black">
                      quantity: {product.quantity ?? 'n/a'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {order.products?.length > 3 && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-6 uppercase text-xs text-black border p-2 bg-flag-blue border-black"
            >
              {isExpanded
                ? 'Hide items'
                : `expand items (${order.products.length - 3})`}
            </button>
          )}
        </div>
      </div>

      {/* Totals & Payment */}
      <div className=" font-mono p-2 flex flex-col space-y-1">
        {(order.paymentMethod ||
          typeof order.cashReceived === 'number' ||
          typeof order.cardAmount === 'number' ||
          typeof order.changeGiven === 'number') && (
          <div className="mt-4">
            <p className="text-xs border-b pb-3 uppercase font-semibold text-gray-500 mb-1">
              payment details
            </p>

            <div className="flex justify-between">
              <p className="uppercase text-xs mb-1 text-gray-600">
                total items:
              </p>
              <p className="font-bold text-xs">{totalItems}</p>
            </div>

            <div className="flex justify-between">
              <p className="uppercase text-xs mb-1 text-gray-600">subtotal:</p>
              <p className="font-bold text-xs">
                {formatCurrency(subtotal, order.currency || 'usd')}
              </p>
            </div>

            {typeof order.tax === 'number' && (
              <div className="flex justify-between">
                <p className="uppercase text-xs mb-1 text-gray-600">tax:</p>
                <p className="font-bold text-xs">
                  {formatCurrency(order.tax, order.currency || 'usd')}
                </p>
              </div>
            )}

            <div className="flex justify-between border-b">
              <p className="uppercase text-xs mb-1 text-gray-600 ">
                sale total:
              </p>
              <p className="font-bold text-sm text-green">
                {formatCurrency(order.totalPrice ?? 0, order.currency || 'usd')}
              </p>
            </div>

            {order.paymentMethod && (
              <div className="flex justify-between pt-3 border-b">
                <p className="text-xs  pb-2 uppercase font-semibold text-gray-500 mb-1">
                  payment method
                </p>
                <p className="font-bold text-xs">{order.paymentMethod}</p>
              </div>
            )}

            {typeof order.cardAmount === 'number' && (
              <div className="flex justify-between pt-2">
                <p className="uppercase text-xs text-gray-600">card amount:</p>
                <p className="font-bold text-xs">
                  {formatCurrency(order.cardAmount, order.currency || 'usd')}
                </p>
              </div>
            )}

            {typeof order.cashReceived === 'number' && (
              <div className="flex justify-between ">
                <p className="uppercase text-xs text-gray-600">
                  cash received:
                </p>
                <p className="font-bold text-xs">
                  {formatCurrency(order.cashReceived, order.currency || 'usd')}
                </p>
              </div>
            )}

            {typeof order.changeGiven === 'number' && (
              <div className="flex justify-between pb-2 border-black">
                <p className="uppercase text-xs text-gray-600">change given:</p>
                <p className="font-bold text-xs">
                  {formatCurrency(order.changeGiven, order.currency || 'usd')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 border-t pt-2 border-black">
          <p className="text-xs font-light uppercase text-gray-600">
            payment status:{' '}
            <span
              className={`font-bold ${
                order.paymentStatus === 'paid_in_store' ||
                order.paymentStatus === 'paid_online'
                  ? 'text-green'
                  : 'text-flag-red'
              }`}
            >
              {order.paymentStatus === 'paid_in_store'
                ? 'Paid In Store'
                : order.paymentStatus === 'paid_online'
                  ? 'Paid Online'
                  : order.paymentMethod === 'online_unpaid'
                    ? 'Unpaid (Online Reservation)'
                    : 'Unpaid online reservation'}
            </span>
          </p>

          <p className="text-xs font-light uppercase text-gray-600">
            pickup status:{' '}
            <span
              className={`font-bold ${
                order.pickupStatus === 'picked_up'
                  ? 'text-green'
                  : 'text-flag-red'
              }`}
            >
              {order.pickupStatus === 'picked_up'
                ? 'Picked up'
                : 'Not picked up'}
            </span>
          </p>
        </div>
      </div>

      {/* View Order Button */}
      {showDetailButton && (
        <div className="p-4 border-t border-black flex justify-center">
          <Link
            href={`/admin/orders/${order.orderNumber}`}
            className="p-4 mb-2 block uppercase text-xs font-light text-center bg-flag-blue text-black w-full"
          >
            View Order
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
