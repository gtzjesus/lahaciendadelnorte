'use server';

import { backendClient } from '@/sanity/lib/backendClient'; // <-- Use the write client here
import { GroupedBasketItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export async function createReservation(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  try {
    console.log('createReservation metadata:', metadata);

    const nameToUse = metadata.customerName?.trim() || metadata.customerEmail;

    const orderDoc = {
      _id: `order-${uuidv4()}`,
      _type: 'order',
      orderNumber: metadata.orderNumber,
      clerkUserId: metadata.clerkUserId,
      customerName: nameToUse, // fallback here
      email: metadata.customerEmail,
      products: items.map((item) => ({
        _key: uuidv4(),
        product: { _type: 'reference', _ref: item.product._id },
        quantity: item.quantity,
      })),
      totalPrice: items.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      ),
      currency: 'usd',
      amountDiscount: 0,
      status: 'reserved',
      orderDate: new Date().toISOString(),
    };

    await backendClient.create(orderDoc);

    return { success: true, orderNumber: metadata.orderNumber };
  } catch (err) {
    console.error('Error creating reservation:', err);
    throw err;
  }
}
