import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  order: any; // Ideally, replace with proper type
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white border border-flag-blue p-2 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-flag-blue">
        <div className="flex flex-row justify-between">
          <div>
            <p className="text-xs uppercase font-light font-mono">
              reservation number
            </p>
            <span
              className="font-mono uppercase font-light text-xs text-green-600 dark:text-green-400"
              title={order.orderNumber || ''}
            >
              {order.orderNumber?.slice(-6)}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase font-light font-mono text-gray-600">
              reserved on
            </p>
            <p className="font-light text-xs mt-1">
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : 'n/a'}
            </p>
          </div>
        </div>
      </div>

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

      <div className="border-t border-flag-blue font-mono p-4 flex flex-col">
        <div className="flex justify-between">
          <p className="uppercase text-xs mb-1 text-gray-600">
            estimated total:
          </p>
          <p className="font-bold text-xs">${order.totalPrice?.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
        <p className="text-xs font-light uppercase text-gray-600">
          payment status:{' '}
          <span
            className={`font-bold ${
              order.paymentStatus === 'paid'
                ? 'text-green-700'
                : 'text-flag-red'
            }`}
          >
            {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
          </span>
        </p>

        <p className="text-xs font-light uppercase text-gray-600">
          pickup status:{' '}
          <span
            className={`font-bold ${
              order.pickupStatus === 'picked_up'
                ? 'text-green-700'
                : 'text-flag-red'
            }`}
          >
            {order.pickupStatus === 'picked_up' ? 'Picked up' : 'Not picked up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
