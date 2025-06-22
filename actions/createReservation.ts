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

    const txn = backendClient.transaction();

    // 🧾 Add the order document
    txn.create(orderDoc);

    // 👤 Check if customer exists
    const existingCustomer = await backendClient.fetch(
      `*[_type == "customer" && (clerkUserId == $clerkUserId || email == $email)][0]`,
      {
        clerkUserId: metadata.clerkUserId,
        email: metadata.customerEmail,
      }
    );

    if (existingCustomer) {
      // Patch existing customer to add order reference
      const customerPatch = backendClient
        .patch(existingCustomer._id)
        .setIfMissing({ orders: [] })
        .append('orders', [{ _type: 'reference', _ref: orderId }]);

      txn.patch(customerPatch);
    } else {
      // Create new customer
      txn.create({
        _type: 'customer',
        clerkUserId: metadata.clerkUserId,
        name: nameToUse,
        email: metadata.customerEmail,
        stripeCustomerId: 'N/A',
        orders: [{ _type: 'reference', _ref: orderId }],
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      });
    }

    // 📉 Decrement stock for each product
    for (const item of items) {
      const productId = item.product._id;
      const quantityToDecrement = item.quantity;

      if (!item.product._rev) {
        throw new Error(`Missing _rev for product ${productId}`);
      }

      const patch = backendClient
        .patch(productId)
        .ifRevisionId(item.product._rev)
        .dec({ stock: quantityToDecrement });

      txn.patch(patch);
    }

    // ✅ Commit the full transaction atomically
    await txn.commit();

    return { success: true, orderNumber: metadata.orderNumber };
  } catch (err) {
    console.error('🚨 Reservation failed:', err);
    throw new Error(
      'Reservation failed. Item may be out of stock. Please refresh and try again.'
    );
  }
}
