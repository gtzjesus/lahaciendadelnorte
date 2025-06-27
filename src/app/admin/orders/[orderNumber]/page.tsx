// src/app/admin/orders/[orderNumber]/page.tsx

import { getOrderByOrderNumber } from '@/sanity/lib/orders/getOrderByOrderNumber';
import { notFound } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import { formatCurrency } from '@/lib/formatCurrency';
import Image from 'next/image';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProductItem {
  quantity?: number;
  _key: string;
  product?: {
    name: string;
    price?: number;
    image?: any;
    slug?: { current: string };
  };
}

interface Order {
  orderNumber?: string;
  customerName?: string;
  totalPrice?: number;
  currency?: string;
  paymentStatus?: string;
  pickupStatus?: string;
  orderDate?: string;
  products?: ProductItem[];
}

// ✅ FIX: mark as async and await params
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params; // ✅ await the params

  const order: Order | null = await getOrderByOrderNumber(orderNumber);

  if (!order) return notFound();

  const totalItems = order.products?.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6 border-flag-blue">
      {/* Header */}
      <div className="p-4 border-b border-flag-blue">
        <div className="flex justify-between font-mono">
          <div>
            <p className="text-xs uppercase font-light">order number</p>
            <p className="text-flag-blue font-light uppercase text-sm">
              {order.orderNumber?.slice(-6)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-light">sale date</p>
            <p className="text-flag-red text-sm mt-1">
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : 'n/a'}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="font-mono p-4">
        <p className="text-xs uppercase font-light text-gray-600 mb-2">items</p>
        <div className="space-y-4">
          {order.products?.map((item, idx) => {
            const product = item.product;
            if (!product) return null;

            const productTotal =
              product.price && item.quantity
                ? formatCurrency(
                    product.price * item.quantity,
                    order.currency || 'usd'
                  )
                : '—';

            return (
              <div
                key={item._key || idx}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-flag-blue pb-4"
              >
                {product.image && (
                  <div className="w-20 h-20 relative">
                    <Image
                      src={imageUrl(product.image).url()}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="uppercase">
                  <p className="text-xs font-light">{product.name}</p>
                  <p className="text-xs text-gray-600 pt-2 pb-2">
                    Quantity: {item.quantity ?? 'n/a'}
                  </p>
                  <p className="text-xs text-green-700">{productTotal}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-flag-blue font-mono p-4 flex flex-col space-y-1">
        <div className="flex justify-between">
          <p className="uppercase text-xs text-gray-600">total items:</p>
          <p className="text-xs font-bold">{totalItems}</p>
        </div>
        <div className="flex justify-between">
          <p className="uppercase text-xs text-green">sale total:</p>
          <p className="text-xs font-bold text-green">
            {formatCurrency(order.totalPrice ?? 0, order.currency || 'usd')}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 border-t border-flag-blue">
        <p className="text-xs font-light uppercase text-gray-600">
          payment status:{' '}
          <span
            className={`font-bold ${
              order.paymentStatus === 'paid_in_store'
                ? 'text-green'
                : 'text-flag-red'
            }`}
          >
            {order.paymentStatus === 'paid_in_store' ? 'Paid' : 'Unpaid'}
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
            {order.pickupStatus === 'picked_up' ? 'Picked up' : 'Not picked up'}
          </span>
        </p>
      </div>
    </div>
  );
}
