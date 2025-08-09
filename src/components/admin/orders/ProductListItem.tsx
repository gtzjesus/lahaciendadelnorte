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

  const lineTotal =
    typeof product?.price === 'number' && typeof product?.quantity === 'number'
      ? product.price * product.quantity
      : 0;

  return (
    <div className="flex flex-col justify-center items-center text-center border-b border-red-300 py-2">
      {image && slug && (
        <Link href={`/product/${slug}`} className="relative h-12 w-12 shrink-0">
          <Image
            src={image}
            alt={prod?.name || 'Product image'}
            fill
            className="object-cover"
          />
        </Link>
      )}

      <div className="flex flex-col text-xs py-2 font-light uppercase">
        <div className="flex justify-center items-center gap-1">
          <p className="font-semibold">{prod?.name}</p>
          <p>|</p>
          {product.variant?.size && (
            <p className="font-semibold">{product.variant.size}</p>
          )}
        </div>

        {prod?.category?.title && <p>{prod.category.title}</p>}

        <div className="flex justify-center items-center gap-1">
          {typeof product?.price === 'number' && (
            <p className="lowercase">
              {formatCurrency(product.price, currency || 'usd')}/ea
            </p>
          )}
          <p>Qty: {product.quantity}</p>
        </div>

        {/* 🧮 Line Total */}
        <div className="text-xs text-green font-light">
          {formatCurrency(lineTotal, currency || 'usd')}
        </div>
      </div>
    </div>
  );
}
