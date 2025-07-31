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
        {formatCurrency(order.totalPrice ?? 0, order.currency || 'usd')}
      </strong>
    </div>

    <div className=" space-y-1 ">
      {order.paymentMethod && (
        <p>
          Payment: <strong>{order.paymentMethod}</strong>
        </p>
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

      <p className="border-t pt-2 border-black">
        Status:{' '}
        <strong
          className={
            order.paymentStatus === 'paid_in_store' ||
            order.paymentStatus === 'paid_online'
              ? 'text-green'
              : 'text-flag-red'
          }
        >
          {(order.paymentStatus ?? 'unknown').replaceAll('_', ' ')}
        </strong>
      </p>
      <p>
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

export default OrderSummary;
