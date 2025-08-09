'use client';

import type { Order, OrderProduct } from '@/types/admin/order';
import ProductListItem from './ProductListItem';

interface ProductListProps {
  products: OrderProduct[];
  order: Order;
}

const ProductList: React.FC<ProductListProps> = ({ products, order }) => (
  <div className="space-y-1 my-1 text-xs">
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

    {products?.map((product, index) => (
      <ProductListItem
        key={product._key ?? index}
        product={product}
        currency={order.currency}
      />
    ))}
  </div>
);

export default ProductList;
