// lib/stripe/handleCheckoutSession.ts

import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { backendClient } from '@/sanity/lib/backendClient';
import { Metadata } from 'actions/createCheckoutSession';
import { syncCustomerToSanity } from '@/sanity/lib/customers/syncCustomerToSanity';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock';

/**
 * Handles a completed Stripe Checkout Session.
 * - Syncs customer to Sanity
 * - Records the order in Sanity
 * - Updates customer's order list and total spent
 * - Decreases product stock
 *
 * @param session Stripe Checkout Session object
 * @returns The created Sanity order document
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, clerkUserId } = metadata as Metadata;

  // 🔁 Sync customer to Sanity
  const stripeCustomer = await syncCustomerToSanity(customer as string);

  // 🛒 Retrieve line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(id, {
    expand: ['data.price.product'],
  });

  // 📦 Extract productId + variantSize from metadata.items
  const items: Array<{ id: string; quantity: number }> = JSON.parse(
    session.metadata?.items || '[]'
  );

  const itemMap: Record<string, { quantity: number; variantSize: string }> = {};

  for (const item of items) {
    const [productId, variantSize] = item.id.split('-');

    if (!productId || !variantSize) {
      throw new Error(`Invalid product id format: ${item.id}`);
    }

    itemMap[productId] = {
      quantity: item.quantity,
      variantSize,
    };
  }

  // 🧱 Convert Stripe products to Sanity references
  const sanityProducts = lineItems.data.map((item) => {
    const stripeProduct = item.price?.product as Stripe.Product;
    const [, variantSize] = (item.description || '').split(' - '); // adjust if needed

    return {
      _key: crypto.randomUUID(),
      product: {
        _type: 'reference',
        _ref: stripeProduct.metadata.id,
      },
      quantity: item.quantity || 0,
      variantSize,
      price: (item.amount_total || 0) / 100 / (item.quantity || 1), // unit price
    };
  });

  // 💰 Compute totals
  const subtotal = (amount_total || 0) / 100;
  const tax = parseFloat((subtotal * 0.0825).toFixed(2)); // 8.25% tax

  // 🧾 Create the order document
  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    clerkUserId,
    customerName: stripeCustomer.name,
    email: stripeCustomer.email,
    currency,
    amountDiscount: (total_details?.amount_discount || 0) / 100,
    tax,
    products: sanityProducts,
    totalPrice: subtotal,
    status: 'paid',
    orderDate: new Date().toISOString(),
  });

  console.log('✅ Order synced to Sanity:', order);

  // 🔁 Update the customer document with new order
  await backendClient
    .patch(stripeCustomer._id)
    .setIfMissing({ orders: [], totalSpent: 0 })
    .append('orders', [
      {
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: order._id,
      },
    ])
    .inc({ totalSpent: order.totalPrice })
    .commit();

  console.log(`✅ Customer order list updated for: ${stripeCustomer._id}`);

  // 📉 Decrease stock for each product variant
  for (const item of items) {
    const [productId, variantSize] = item.id.split('-');

    if (!productId || !variantSize) {
      throw new Error(`Invalid product id format: ${item.id}`);
    }

    await decreaseProductStock(productId, variantSize, item.quantity);
  }

  return order;
}
