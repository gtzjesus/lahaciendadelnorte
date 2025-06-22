'use server';

import { backendClient } from '@/sanity/lib/backendClient';
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
    const orderId = `order-${uuidv4()}`;
    const nameToUse = metadata.customerName?.trim() || metadata.customerEmail;

    // 1. Create the order document
    const orderDoc = {
      _id: orderId,
      _type: 'order',
      orderNumber: metadata.orderNumber,
      clerkUserId: metadata.clerkUserId,
      customerName: nameToUse,
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

    // 2. Try to find the customer by clerkUserId OR email
    const existingCustomer = await backendClient.fetch(
      `*[_type == "customer" && (clerkUserId == $clerkUserId || email == $email)][0]`,
      {
        clerkUserId: metadata.clerkUserId,
        email: metadata.customerEmail,
      }
    );

    if (existingCustomer) {
      // 3a. Update existing customer with new order
      await backendClient
        .patch(existingCustomer._id)
        .setIfMissing({ orders: [] })
        .append('orders', [{ _type: 'reference', _ref: orderId }])
        .commit();
    } else {
      // 3b. Create new customer document
      const customerDoc = {
        _type: 'customer',
        clerkUserId: metadata.clerkUserId,
        name: nameToUse,
        email: metadata.customerEmail,
        stripeCustomerId: 'N/A', // or generate if Stripe is integrated later
        orders: [{ _type: 'reference', _ref: orderId }],
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };

      await backendClient.create(customerDoc);
    }

    return { success: true, orderNumber: metadata.orderNumber };
  } catch (err) {
    console.error('Error creating reservation:', err);
    throw err;
  }
}
