'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import type { OrderProduct } from '@/types/admin/order';

interface ProductListItemProps {
  product: OrderProduct;
  currency?: string;
}

export default function ProductListItem({
  product,
  currency,
}: ProductListItemProps) {
  const prod = product.product;
  const slug = prod?.slug?.current;
  const image = prod?.image ? imageUrl(prod.image).url() : null;

  return (
    <div className="flex flex-col justify-center items-center text-center border-b border-red-200 pb-2">
      {image && slug && (
        <Link href={`/product/${slug}`} className="relative h-16 w-16 shrink-0">
          <Image
            src={image}
            alt={prod?.name || 'Product image'}
            fill
            className="object-cover rounded"
          />
        </Link>
      )}
      <div className="text-xs font-light uppercase">
        <p className="font-semibold">{prod?.name}</p>
        {product.variant?.size && <p>{product.variant.size}</p>}
        {prod?.category?.title && <p>{prod.category.title}</p>}
        {typeof product?.price === 'number' && (
          <p>{formatCurrency(product.price, currency || 'usd')}</p>
        )}
        <p>Qty: {product.quantity}</p>
      </div>
    </div>
  );
}
