'use client';

import type { Order } from '@/types/admin/order';
import { formatCurrency } from '@/lib/formatCurrency';

interface OrderSummaryProps {
  order: Order;
  totalItems: number;
  subtotal: number;
  pickupStatus?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  totalItems,
  subtotal,
  pickupStatus,
}) => (
  <div className="uppercase text-xs  space-y-1">
    <div className="flex justify-between">
      <span>items</span>
      <span>{totalItems}</span>
    </div>
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>{formatCurrency(subtotal, order.currency || 'usd')}</span>
    </div>
    {order.tax && (
      <div className="flex justify-between">
        <span>Tax</span>
        <span>{formatCurrency(order.tax, order.currency || 'usd')}</span>
      </div>
    )}
    <div className="flex justify-between border-b border-red-200 pb-1">
      <strong>Total</strong>
      <strong className="text-green">
        {formatCurrency(order.totalPrice ?? 0, order.currency || 'usd')}
      </strong>
    </div>

    <div className=" space-y-1 ">
      {order.paymentMethod && (
        <div className="flex justify-between">
          <p>Payment</p>
          <p className="font-bold">{order.paymentMethod}</p>
        </div>
      )}
      {order.paymentMethod === 'cash' && (
        <>
          <p>
            Cash Received:{' '}
            <strong>
              {formatCurrency(order.cashReceived || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p>
            Change Given:{' '}
            <strong>
              {formatCurrency(order.changeGiven || 0, order.currency || 'usd')}
            </strong>
          </p>
        </>
      )}

      {order.paymentMethod === 'split' && (
        <>
          <p>
            Cash Received:{' '}
            <strong>
              {formatCurrency(order.cashReceived || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p>
            Card Amount:{' '}
            <strong>
              {formatCurrency(order.cardAmount || 0, order.currency || 'usd')}
            </strong>
          </p>
          <p>
            Change Given:{' '}
            <strong>
              {formatCurrency(order.changeGiven || 0, order.currency || 'usd')}
            </strong>
          </p>
        </>
      )}
      <div className=" flex justify-between border-t pt-1 border-red-200">
        Status:{' '}
        <p
          className={
            order.paymentStatus === 'paid_in_store' ||
            order.paymentStatus === 'paid_online'
              ? 'text-green font-bold'
              : 'text-flag-red font-bold'
          }
        >
          {(order.paymentStatus ?? 'unknown').replaceAll('_', ' ')}
        </p>
      </div>
      <div className=" flex justify-between  ">
        Pickup:{' '}
        <p
          className={
            pickupStatus === 'completed'
              ? 'text-green font-bold'
              : 'text-red-600 font-bold'
          }
        >
          {pickupStatus?.replaceAll('_', ' ') ??
            order.pickupStatus.replaceAll('_', ' ')}
        </p>
      </div>
    </div>
  </div>
);

export default OrderSummary;
