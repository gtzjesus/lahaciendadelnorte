'use client';

import type { Order, OrderProduct } from '@/types/admin/order';
import ProductListItem from './ProductListItem';

interface ProductListProps {
  products: OrderProduct[];
  order: Order;
}
const ProductList: React.FC<ProductListProps> = ({ products, order }) => (
  <div className="space-y-1 my- text-xs">
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
