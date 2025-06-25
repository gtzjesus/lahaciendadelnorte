import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/sanity/lib/client';

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type RequestBody = {
  items: OrderItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { items }: RequestBody = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No items provided' });
    }

    // Validate items
    for (const item of items) {
      if (
        typeof item.productId !== 'string' ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1 ||
        typeof item.price !== 'number' ||
        item.price < 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid item format' });
      }
    }

    // Calculate total price
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.0825; // 8.25% tax
    const totalPrice = subtotal + tax;

    // Generate order number (simple timestamp + random)
    const orderNumber =
      'ORD-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);

    // Get clerkUserId from auth/session -- replace with your logic
    const clerkUserId = 'clerk-placeholder';

    // Placeholder customer info, replace with real if available
    const customerName = 'Walk-in Customer';
    const email = 'customer@example.com';

    // Prepare products array with references
    const productsForSanity = items.map((item) => ({
      _type: 'object',
      product: {
        _type: 'reference',
        _ref: item.productId,
      },
      quantity: item.quantity,
    }));

    // Create order document in Sanity
    const orderDoc = {
      _type: 'order',
      orderNumber,
      clerkUserId,
      customerName,
      email,
      products: productsForSanity,
      totalPrice,
      currency: 'usd',
      amountDiscount: 0,
      orderType: 'reservation',
      paymentStatus: 'paid_in_store',
      pickupStatus: 'not_picked_up',
      orderDate: new Date().toISOString(),
    };

    const createdOrder = await client.create(orderDoc);

    return res.status(201).json({
      success: true,
      orderId: createdOrder._id,
      orderNumber: createdOrder.orderNumber,
    });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Server error' });
  }
}
