import { getOrderByOrderNumber } from '@/sanity/lib/orders/getOrderByOrderNumber';
import { notFound } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';

interface ProductItem {
  quantity?: number;
  _key: string;
  product?: {
    name: string;
    price?: number;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    image?: any;
  };
}

interface Order {
  orderNumber?: string;
  customerName?: string;
  totalPrice?: number;
  status?: string;
  orderDate?: string;
  products?: ProductItem[];
}

export default async function OrderDetailPage({ params }: { params: unknown }) {
  const { orderNumber } = params as { orderNumber: string };
  const order: Order | null = await getOrderByOrderNumber(orderNumber);

  if (!order) return notFound();

  return (
    <div className="bg-[#fff] m-4 p-8 max-w-3xl mx-auto">
      <div className="uppercase flex justify-between">
        <h1 className="text-xl text-[#2E8B57] font-bold">
          Order #{order.orderNumber}
        </h1>
        <p className="text-flag-red">
          Date:{' '}
          {order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : 'n/a'}
        </p>
      </div>

      <div className="uppercase text-md mt-6">
        <p className="text-flag-blue">Customer: {order.customerName}</p>
        <p>Status: {order.status}</p>
        <p className="text-[#2E8B57]">Total: ${order.totalPrice?.toFixed(2)}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-md uppercase font-semibold mb-2">
          purchased items:
        </h2>
        <ul className="space-y-4">
          {order.products?.map((item: ProductItem, idx: number) => {
            const product = item.product;
            if (!product) return null;

            return (
              <li
                key={item._key || idx}
                className="flex gap-10 border border-flag-blue p-3"
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
                <div className="uppercase mt-2">
                  <p className="text-xs font-medium">{product.name}</p>
                  <p className="text-xs text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-green-600">
                    $
                    {product.price && item.quantity
                      ? (product.price * item.quantity).toFixed(2)
                      : '—'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
