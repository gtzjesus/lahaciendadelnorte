'use server';

import { backendClient } from '@/sanity/lib/backendClient';
import { GroupedBasketItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  status?: string; // add this line
};

type ProductRevision = {
  _id: string;
  _rev: string;
  stock: number;
};

export async function createReservation(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  try {
    const orderId = `order-${uuidv4()}`;
    const nameToUse = metadata.customerName?.trim() || metadata.customerEmail;

    // Fetch latest _rev and stock for all products in the basket
    const productIds = items.map((item) => item.product._id);
    const latestProducts: ProductRevision[] = await backendClient.fetch(
      `*[_type == "product" && _id in $ids]{ _id, _rev, stock }`,
      { ids: productIds }
    );

    // Validate stock availability before committing the transaction
    for (const item of items) {
      const latestProduct = latestProducts.find(
        (p: ProductRevision) => p._id === item.product._id
      );
      if (!latestProduct) {
        throw new Error(`Product ${item.product._id} not found`);
      }
      if (latestProduct.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${item.product._id}. Available: ${latestProduct.stock}, requested: ${item.quantity}`
        );
      }
    }

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

      // ✅ explicitly set statuses
      orderType: 'reservation',
      paymentStatus: 'unpaid',
      pickupStatus: 'not_picked_up',

      orderDate: new Date().toISOString(),
    };

    const txn = backendClient.transaction();

    // Add the order document
    txn.create(orderDoc);

    // Check if customer exists
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

    // Decrement stock for each product using the latest _rev from Sanity
    for (const item of items) {
      const latestProduct = latestProducts.find(
        (p: ProductRevision) => p._id === item.product._id
      );
      if (!latestProduct) {
        throw new Error(`Product ${item.product._id} not found in latest data`);
      }

      const patch = backendClient
        .patch(latestProduct._id)
        .ifRevisionId(latestProduct._rev) // Use latest revision here!
        .dec({ stock: item.quantity });

      txn.patch(patch);
    }

    // Commit the full transaction atomically
    await txn.commit();

    return { success: true, orderNumber: metadata.orderNumber };
  } catch (err) {
    console.error('🚨 Reservation failed:', err);
    throw new Error(
      'Reservation failed. Item may be out of stock or the data is stale. Please refresh and try again.'
    );
  }
}
