// /sanity/lib/orders/getOrderByOrderNumber.ts

import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function getOrderByOrderNumber(orderNumber: string) {
  return await client.fetch(
    groq`
      *[_type == "order" && orderNumber == $orderNumber][0]{
        _id,
        orderNumber,
        clerkUserId,
        customerName,
        email,
        products[] {
          quantity,
          itemNumber,
          _key,
          product->{
            _id,
            name,
            slug,
            image,
            price
          }
        },
        totalPrice,
        tax,
        currency,
        amountDiscount,
        orderType,
        paymentStatus,
        pickupStatus,
        orderDate,
        paymentMethod,
        cashReceived,
        cardAmount,
        changeGiven
      }
    `,
    { orderNumber }
  );
}
