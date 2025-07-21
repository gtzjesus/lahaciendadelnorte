// lib/sanity/createOrder.ts

import { backendClient } from '@/sanity/lib/backendClient';

/**
 * Creates an order document in Sanity with full variant info.
 *
 * @param orderData - Object containing order details and products
 * @returns Created Sanity order document
 */
export async function createOrder(orderData: {
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  email: string;
  currency: string;
  amountDiscount?: number;
  tax: number;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    variant: {
      size: string;
      price: number;
      stock?: number;
    };
  }>;
  totalPrice: number;
  paymentStatus?: string;
  pickupStatus?: string;
  orderType?: string;
  paymentMethod?: string;
  cashReceived?: number;
  cardAmount?: number;
  changeGiven?: number;
  orderDate: string;
}) {
  const {
    orderNumber,
    clerkUserId,
    customerName,
    email,
    currency,
    amountDiscount = 0,
    tax,
    products,
    totalPrice,
    paymentStatus = 'unpaid',
    pickupStatus = 'not_picked_up',
    orderType = 'reservation',
    paymentMethod,
    cashReceived,
    cardAmount,
    changeGiven,
    orderDate,
  } = orderData;

  // Transform products into Sanity format with references and variant objects
  const sanityProducts = products.map(
    ({ productId, quantity, price, variant }) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: 'reference',
        _ref: productId,
      },
      quantity,
      price,
      variant,
    })
  );

  // Create order document in Sanity
  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    clerkUserId,
    customerName,
    email,
    currency,
    amountDiscount,
    tax,
    products: sanityProducts,
    totalPrice,
    paymentStatus,
    pickupStatus,
    orderType,
    paymentMethod,
    cashReceived,
    cardAmount,
    changeGiven,
    orderDate,
  });

  console.log('✅ Order created in Sanity:', order);

  return order;
}
