import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  order: any; // Ideally, replace with proper type
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const totalItems = order.products?.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  return (
    <div className="bg-white border border-flag-blue p-2 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-flag-blue">
        <div className="flex flex-row justify-between">
          <div>
            <p className="text-xs uppercase font-light font-mono">
              order number
            </p>
            <span
              className="font-mono uppercase font-light text-xs text-flag-blue dark:text-green"
              title={order.orderNumber || ''}
            >
              {order.orderNumber?.slice(-6)}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase font-light font-mono">sale date</p>
            <p className="font-light text-xs mt-1 text-flag-red">
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : 'n/a'}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="font-mono p-4">
        <p className="text-xs uppercase font-light text-gray-600">items</p>

        <div>
          {order.products?.map((product: any) => {
            const prod = product.product;
            const slug = prod?.slug?.current;

            return (
              <div
                key={prod?._id}
                className="flex flex-col border-b border-flag-blue last:border-b-0"
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
                    {slug ? (
                      <Link
                        href={`/product/${slug}`}
                        className="font-xs uppercase text-gray-600 font-light mb-1 mt-2 hover:underline"
                      >
                        {prod?.name}
                      </Link>
                    ) : (
                      <p className="font-xs uppercase text-gray-600 font-light mb-1 mt-2">
                        {prod?.name}
                      </p>
                    )}
                    <p className="text-xs uppercase font-light text-gray-600">
                      quantity: {product.quantity ?? 'n/a'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-green-800 mb-1 text-xs text-right">
                    {prod?.price && product.quantity
                      ? formatCurrency(
                          prod.price * product.quantity,
                          order.currency
                        )
                      : 'n/a'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-flag-blue font-mono p-4 flex flex-col space-y-1">
        <div className="flex justify-between">
          <p className="uppercase text-xs mb-1 text-gray-600">total items:</p>
          <p className="font-bold text-xs">{totalItems}</p>
        </div>
        <div className="flex justify-between">
          <p className="uppercase text-xs mb-1 text-gray-600">sale total:</p>
          <p className="font-bold text-xs">${order.totalPrice?.toFixed(2)}</p>
        </div>

        {/* Payment Details */}
        {(order.paymentMethod ||
          order.cashReceived !== undefined ||
          order.cardAmount !== undefined) && (
          <div className="mt-4">
            <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
              payment details
            </p>

            {order.paymentMethod && (
              <div className="flex justify-between">
                <p className="uppercase text-xs text-gray-600">method:</p>
                <p className="font-bold text-xs">{order.paymentMethod}</p>
              </div>
            )}

            {order.cashReceived !== undefined && (
              <div className="flex justify-between">
                <p className="uppercase text-xs text-gray-600">
                  cash received:
                </p>
                <p className="font-bold text-xs">
                  ${order.cashReceived.toFixed(2)}
                </p>
              </div>
            )}

            {order.cardAmount !== undefined && (
              <div className="flex justify-between">
                <p className="uppercase text-xs text-gray-600">card amount:</p>
                <p className="font-bold text-xs">
                  ${order.cardAmount.toFixed(2)}
                </p>
              </div>
            )}

            {order.changeGiven !== undefined && (
              <div className="flex justify-between">
                <p className="uppercase text-xs text-gray-600">change given:</p>
                <p className="font-bold text-xs">
                  ${order.changeGiven.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
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

      {/* 🔗 View Order Button */}
      <div className="p-4 border-t border-flag-blue flex justify-center">
        <Link
          href={`/admin/orders/${order.orderNumber}`}
          className="p-4 mb-2 block uppercase text-xs font-light text-center bg-flag-blue text-white w-full"
        >
          View firework Order
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
