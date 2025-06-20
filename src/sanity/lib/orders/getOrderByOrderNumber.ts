// /sanity/lib/orders/getOrderByOrderNumber.ts

import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function getOrderByOrderNumber(orderNumber: string) {
  return await client.fetch(
    groq`
      *[_type == "order" && orderNumber == $orderNumber][0]{
        _id,
        orderNumber,
        customerName,
        totalPrice,
        status,
        orderDate,
        currency,
        products[] {
          quantity,
          product->{
            _id,
            name,
            price,
            slug,
            image
          }
        }
      }
    `,
    { orderNumber }
  );
}
